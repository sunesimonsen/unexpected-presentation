/**
 * The reveal.js markdown plugin. Handles parsing of
 * markdown inside of presentations as well as loading
 * of external markdown documents.
 */
(function( root, factory ) {
    if( typeof exports === 'object' ) {
        module.exports = factory( require( './marked' ) );
    }
    else {
        // Browser globals (root is window)
        root.RevealMarkdown = factory( root.marked );
        root.RevealMarkdown.initialize();
    }
}( this, function( marked ) {

    if( typeof marked === 'undefined' ) {
        throw 'The reveal.js Markdown plugin requires marked to be loaded';
    }

    if( typeof hljs !== 'undefined' ) {
        marked.setOptions({
            highlight: function( lang, code ) {
                return hljs.highlightAuto( lang, code ).value;
            }
        });
    }

    var DEFAULT_SLIDE_SEPARATOR = '^\r?\n---\r?\n$',
        DEFAULT_NOTES_SEPARATOR = 'note:',
        DEFAULT_ELEMENT_ATTRIBUTES_SEPARATOR = '\\\.element\\\s*?(.+?)$',
        DEFAULT_SLIDE_ATTRIBUTES_SEPARATOR = '\\\.slide:\\\s*?(\\\S.+?)$';

    function markdownToHtml(markdown, cb) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST","http://localhost:1949",true);
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xhr.onload = function() {
            var status = xhr.status;
            if (status === 200) {
                cb(null, xhr.response);
            } else {
                cb(new Error('Could not connect to the markdown server http://localhost:1949'));
            }
        };
        xhr.send("markdown=" + encodeURIComponent(markdown));
    }

    /**
     * Retrieves the markdown contents of a slide section
     * element. Normalizes leading tabs/whitespace.
     */
    function getMarkdownFromSlide( section ) {

        var template = section.querySelector( 'script' );

        // strip leading whitespace so it isn't evaluated as code
        var text = ( template || section ).textContent;

        var leadingWs = text.match( /^\n?(\s*)/ )[1].length,
            leadingTabs = text.match( /^\n?(\t*)/ )[1].length;

        if( leadingTabs > 0 ) {
            text = text.replace( new RegExp('\\n?\\t{' + leadingTabs + '}','g'), '\n' );
        }
        else if( leadingWs > 1 ) {
            text = text.replace( new RegExp('\\n? {' + leadingWs + '}', 'g'), '\n' );
        }

        return text;

    }

    /**
     * Given a markdown slide section element, this will
     * return all arguments that aren't related to markdown
     * parsing. Used to forward any other user-defined arguments
     * to the output markdown slide.
     */
    function getForwardedAttributes( section ) {

        var attributes = section.attributes;
        var result = [];

        for( var i = 0, len = attributes.length; i < len; i++ ) {
            var name = attributes[i].name,
                value = attributes[i].value;

            // disregard attributes that are used for markdown loading/parsing
            if( /data\-(markdown|separator|vertical|notes)/gi.test( name ) ) continue;

            if( value ) {
                result.push( name + '="' + value + '"' );
            }
            else {
                result.push( name );
            }
        }

        return result.join( ' ' );

    }

    /**
     * Inspects the given options and fills out default
     * values for what's not defined.
     */
    function getSlidifyOptions( options ) {

        options = options || {};
        options.separator = options.separator || DEFAULT_SLIDE_SEPARATOR;
        options.notesSeparator = options.notesSeparator || DEFAULT_NOTES_SEPARATOR;
        options.attributes = options.attributes || '';

        return options;

    }

    /**
     * Helper function for constructing a markdown slide.
     */
    function createMarkdownSlide( content, options ) {

        options = getSlidifyOptions( options );

        var notesMatch = content.split( new RegExp( options.notesSeparator, 'mgi' ) );

        if( notesMatch.length === 2 ) {
            content = notesMatch[0] + '<aside class="notes" data-unexpected-markdown>' + notesMatch[1].trim() + '</aside>';
        }

        return '<script type="text/template">' + content + '</script>';

    }

    /**
     * Parses a data string into multiple slides based
     * on the passed in separator arguments.
     */
    function slidify( markdown, options, target ) {
        options = getSlidifyOptions( options );


        markdown = markdown.replace(/^Note:(.*?)\n\n/gm, function ($0, $1) {
            return '<aside class="notes">' + $1.trim() + '</aside>\n\n';
        });

        markdown = markdown.replace(new RegExp(options.separator, 'mg'), '<!-- unexpected-markdown-slide -->\n');

        if (options.verticalSeparator) {
            markdown = markdown.replace(new RegExp(options.verticalSeparator, 'mg'), '<!-- unexpected-markdown-vertical-slide -->\n');
        }

        // var notes = section.querySelector( 'aside.notes' );

        markdownToHtml(markdown, function (err, html) {
            if (err) {
                target.outerHTML = '<section data-state="alert">' + err.message + '</section>';
            } else {
                var output = html.split('<!-- unexpected-markdown-slide -->').map(function (slide) {
                    var verticalSlides = slide.split('<!-- unexpected-markdown-vertical-slide -->');
                    var result = '<section>\n' + verticalSlides.join('</section><section>') + '</section>'
                    if (verticalSlides.length > 1) {
                        result = '<section>\n' + result + '</section>'
                    }
                    return result;

                }).join('\n');
                target.outerHTML = output;
            }

            // section.setAttribute( 'data-unexpected-markdown-parsed', true )
        });
    }

    /**
     * Parses any current data-unexpected-markdown slides, splits
     * multi-slide markdown into separate sections and
     * handles loading of external markdown.
     */
    function processSlides() {

        var sections = document.querySelectorAll( '[data-unexpected-markdown]'),
            section;

        for( var i = 0, len = sections.length; i < len; i++ ) {

            section = sections[i];

            if( section.getAttribute( 'data-unexpected-markdown' ).length ) {

                var xhr = new XMLHttpRequest(),
                    url = section.getAttribute( 'data-unexpected-markdown' );

                datacharset = section.getAttribute( 'data-charset' );

                // see https://developer.mozilla.org/en-US/docs/Web/API/element.getAttribute#Notes
                if( datacharset != null && datacharset != '' ) {
                    xhr.overrideMimeType( 'text/html; charset=' + datacharset );
                }

                xhr.onreadystatechange = function() {
                    if( xhr.readyState === 4 ) {
                        // file protocol yields status code 0 (useful for local debug, mobile applications etc.)
                        if ( ( xhr.status >= 200 && xhr.status < 300 ) || xhr.status === 0 ) {

                            slidify( xhr.responseText, {
                                separator: section.getAttribute( 'data-separator' ),
                                verticalSeparator: section.getAttribute( 'data-separator-vertical' ),
                                notesSeparator: section.getAttribute( 'data-separator-notes' ),
                                attributes: getForwardedAttributes( section )
                            }, section);

                        } else {
                            section.outerHTML = '<section data-state="alert">' +
                                'ERROR: The attempt to fetch ' + url + ' failed with HTTP status ' + xhr.status + '.' +
                                'Check your browser\'s JavaScript console for more details.' +
                                '<p>Remember that you need to serve the presentation HTML from a HTTP server.</p>' +
                                '</section>';

                        }
                    }
                };

                xhr.open( 'GET', url, false );

                try {
                    xhr.send();
                }
                catch ( e ) {
                    alert( 'Failed to get the Markdown file ' + url + '. Make sure that the presentation and the file are served by a HTTP server and the file can be found there. ' + e );
                }
            } else {
                slidify( getMarkdownFromSlide( section ), {
                    separator: section.getAttribute( 'data-separator' ),
                    verticalSeparator: section.getAttribute( 'data-separator-vertical' ),
                    notesSeparator: section.getAttribute( 'data-separator-notes' ),
                    attributes: getForwardedAttributes( section )
                }, section);

            }
        }

    }

	  // API
	  return {

		    initialize: function() {
			      processSlides();
		    },

		    // TODO: Do these belong in the API?
		    processSlides: processSlides,
		    slidify: slidify

	  };

}));
