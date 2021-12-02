// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'NADA',
  tagline: 'NAV Data - vi bygger plattform og verktøy for deling av data i NAV',
  url: 'https://docs.knada.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'navikt',
  projectName: 'nada',
  trailingSlash: false,

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/navikt/nada/edit/main/',
          routeBasePath: '/',
        },
        adr: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/navikt/nada/edit/main/',
          routeBasePath: '/adr',
        },
        konsepter: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/navikt/nada/edit/main/',
          routeBasePath: '/konsepter',
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
            docId: 'konsepter/README',
            position: 'left',
            label: 'konsepter',
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
