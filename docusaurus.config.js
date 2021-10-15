// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

// Reverse the sidebar items ordering (including nested category items)
function reverseSidebarItems(items) {
  // Reverse items in categories
  const result = items.map((item) => {
    if (item.type === 'category') {
      return { ...item, items: reverseSidebarItems(item.items) };
    }
    return item;
  });
  // Reverse items at current level
  result.reverse();
  return result;
}

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'NADA',
  tagline: 'NAV Data - vi bygger plattform og verktøy for deling av data i NAV',
  url: 'https://navikt.github.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'navikt',
  projectName: 'nada',

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/navikt/nada/edit/master/',
          routeBasePath: '/',
        },
        adr: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/navikt/nada/edit/master/',
          routeBasePath: '/adr',
        },
        concepts: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/navikt/nada/edit/master/',
          routeBasePath: '/concepts',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        logo: {
          alt: 'NADA logo',
          src: 'img/nada.svg',
          srcDark: 'img/nada-darkmode.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'README',
            position: 'left',
            label: 'docs',
          },
          {
            type: 'doc',
            docId: 'adr/README',
            position: 'left',
            label: 'adr',
          },
          {
            type: 'doc',
            docId: 'concepts/README',
            position: 'left',
            label: 'concepts',
          },
          {
            href: 'https://github.com/navikt/nada',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {},
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
