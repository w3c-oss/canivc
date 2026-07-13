// Imports
import BarRating from './_shortcodes/BarRating.js';
import eleventyMermaidPlugin from '@kevingimbel/eleventy-plugin-mermaid';
import {execSync} from 'node:child_process';
import legend from './src/_data/legend.json' with {type: 'json'};
import markdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import mermaidFullscreenJsShortcode from
  './_shortcodes/mermaid_fullscreen_js.js';
import mermaidShortcode from './_shortcodes/mermaid.js';
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';

// Constants
const statusMarks = legend.reduce((all, statusMark) => {
  return {...all, [statusMark.id]: statusMark.icon};
}, {});
const statusColors = legend.reduce((all, statusMark) => {
  return {...all, [statusMark.id]: statusMark.color};
}, {});
const statusLabel = legend.reduce((all, statusMark) => {
  return {...all, [statusMark.id]: statusMark.label};
}, {});

// Eleventy Configurations
export default function(eleventyConfig) {
  /* Markdown Overrides */
  const markdownLibrary = markdownIt({
    html: true,
    linkify: true
  }).use(markdownItAnchor, {
    permalink: false
  });
  eleventyConfig.setLibrary('md', markdownLibrary);

  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(eleventyMermaidPlugin, {
    extra_classes: 'attached'
  });

  // Shortcode components
  eleventyConfig.addShortcode('BarRating', BarRating);

  // add custom JS for loading SVG pan/zoom features
  eleventyConfig.addShortcode(
    'mermaid_with_callback_js',
    mermaidFullscreenJsShortcode
  );
  // add fullscreen-able mermaid display
  eleventyConfig.addPairedShortcode('mermaid', mermaidShortcode);

  // Filter functions
  eleventyConfig.addFilter('getStatusMark', status => statusMarks[status]);
  eleventyConfig.addFilter('getStatusLabel', status => statusLabel[status]);
  eleventyConfig.addFilter('getStatusColors', status => statusColors[status]);
  eleventyConfig.addFilter('getPercentages',
    value => JSON.stringify(Object.values(value)));
  eleventyConfig.addFilter('getOptional', optional => {
    return optional ? 'optional' : 'not-optional';
  });
  eleventyConfig.addFilter('findObjectByProperty', (data, prop, value) => {
    return data ? data.find(item => item[prop] === value) : {};
  });
  eleventyConfig.addFilter('keys', v => {
    return v ? Object.keys(v) : [];
  });
  eleventyConfig.addFilter('removeQuotes', str => {
    return str && str.replaceAll('"', '\'');
  });
  eleventyConfig.addFilter('removeSuffix', str => {
    // Remove P-256 & P-384 vendor name extension
    const endIdx = str.indexOf(': P-') > -1 ?
      str.indexOf(': P-') : str.length;
    return str.slice(0, endIdx);
  });

  // Copy favicon files to root
  eleventyConfig.addPassthroughCopy({'src/images/favicon': '/'});
  eleventyConfig.addPassthroughCopy('src/assets/');
  eleventyConfig.addPassthroughCopy('src/**/*.jpg');
  eleventyConfig.addPassthroughCopy('src/**/*.png');
  eleventyConfig.addPassthroughCopy('src/site.webmanifest');
  // Run pagefind script after site has built
  eleventyConfig.on('eleventy.after', () => {
    execSync(`npx -y pagefind --site _site`, {encoding: 'utf-8'});
  });

  eleventyConfig.addGlobalData('lastGenerated', (new Date()).toISOString());

  // Return your Object options:
  return {
    dir: {
      input: 'src/',

      layouts: '_layouts'
    }
  };
}
