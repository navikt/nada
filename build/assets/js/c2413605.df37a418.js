"use strict";(self.webpackChunknada=self.webpackChunknada||[]).push([[307],{3905:function(e,t,n){n.d(t,{Zo:function(){return d},kt:function(){return u}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),p=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},d=function(e){var t=p(e.components);return r.createElement(l.Provider,{value:t},e.children)},k={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,l=e.parentName,d=s(e,["components","mdxType","originalType","parentName"]),m=p(n),u=a,c=m["".concat(l,".").concat(u)]||m[u]||k[u]||i;return n?r.createElement(c,o(o({ref:t},d),{},{components:n})):r.createElement(c,o({ref:t},d))}));function u(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=m;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:a,o[1]=s;for(var p=2;p<i;p++)o[p]=n[p];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},5470:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return s},contentTitle:function(){return l},metadata:function(){return p},toc:function(){return d},default:function(){return m}});var r=n(7462),a=n(3366),i=(n(7294),n(3905)),o=["components"],s={title:"Airflow"},l=void 0,p={unversionedId:"prosessere-data/onprem/airflow",id:"prosessere-data/onprem/airflow",isDocsHomePage:!1,title:"Airflow",description:"Apache Airflow er et verkt\xf8y for \xe5 orkestrere,",source:"@site/docs/prosessere-data/onprem/airflow.md",sourceDirName:"prosessere-data/onprem",slug:"/prosessere-data/onprem/airflow",permalink:"/prosessere-data/onprem/airflow",editUrl:"https://github.com/navikt/nada/edit/master/docs/prosessere-data/onprem/airflow.md",tags:[],version:"current",frontMatter:{title:"Airflow"},sidebar:"docs",previous:{title:"Getting started",permalink:"/prosessere-data/onprem/getting-started"},next:{title:"Om dataverk",permalink:"/prosessere-data/onprem/dataverk/README"}},d=[{value:"Konfigurasjon",id:"konfigurasjon",children:[{value:"namespace",id:"namespace",children:[]},{value:"ingress",id:"ingress",children:[]},{value:"user",id:"user",children:[]},{value:"dagsRepo",id:"dagsrepo",children:[]},{value:"dagsRepoBranch",id:"dagsrepobranch",children:[]},{value:"repoSyncTime",id:"reposynctime",children:[]},{value:"dvApiEndpoint",id:"dvapiendpoint",children:[]},{value:"dvBucketEndpoint",id:"dvbucketendpoint",children:[]}]},{value:"Dataverk-Airflow",id:"dataverk-airflow",children:[]}],k={toc:d};function m(e){var t=e.components,s=(0,a.Z)(e,o);return(0,i.kt)("wrapper",(0,r.Z)({},k,s,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://airflow.apache.org/docs/apache-airflow/stable/index.html"},"Apache Airflow")," er et verkt\xf8y for \xe5 orkestrere,\nskedulere og monitorere datapipelines. Web-grensesnittet til Airflow gir brukeren enkel tilgang til \xe5 lese logger fra\nde ulike stegene i pipelinen, trigge datapipelines manuelt og sjekke statistikk p\xe5 tidligere kj\xf8ringer."),(0,i.kt)("p",null,"En datapipeline i Airflow, eller DAG (Directed Acyclic Graph), er et sett med oppgaver man \xf8nsker \xe5 kj\xf8re som beskriver\nrekkef\xf8lge og avhengigheter mellom oppgavene. Disse DAG-ene beskrives programmatisk i python filer og legges i et Github\nrepo som periodisk synkroniseres med Airflow instansen. Nedenfor ser du en en grafisk representasjon av flyten i en DAG:"),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"Flyten i en Airflow DAG",src:n(2443).Z})),(0,i.kt)("p",null,"KNADA plattformen tilbyr team eller enkeltpersoner \xe5 sette opp airflow instanser i sine egne k8s namespacer i\nKNADA clusteret."),(0,i.kt)("p",null,"For mer informasjon om Airflow, se ",(0,i.kt)("a",{parentName:"p",href:"https://airflow.apache.org/docs/apache-airflow/stable/index.html"},"Airflow docs")),(0,i.kt)("h2",{id:"konfigurasjon"},"Konfigurasjon"),(0,i.kt)("p",null,"For \xe5 sette opp Airflow m\xe5 man lage en pull request til ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/navikt/knada-airflow"},"navikt/knada-airflow"),"\nog legge til en yaml-fil med f\xf8lgende innhold i katalogen ",(0,i.kt)("em",{parentName:"p"},"configs"),":"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"namespace: <namespace>\ningress: <ingress>\nusers:\n  - <Brukerident 1>\n  - <Brukerident 2>\n  - ...\ndagsRepo: <dagsRepo>\n")),(0,i.kt)("p",null,"Ved hver ny pull request (og endringer) blir sjekker kj\xf8rt automatisk.\nN\xe5r disse sjekkene er godkjente (lyser gr\xf8nt), kan du selv merge inn din pull request.\nDu trenger alts\xe5 ",(0,i.kt)("em",{parentName:"p"},"ikke")," vente p\xe5 godkjenning."),(0,i.kt)("h3",{id:"namespace"},"namespace"),(0,i.kt)("p",null,"Settes til navnet p\xe5 namespacet hvor Airflow instansen skal settes opp. Som regel det samme som JupyterHub-en din."),(0,i.kt)("h3",{id:"ingress"},"ingress"),(0,i.kt)("p",null,"Blir prefikset for adressen til Airflow web grensesnittet, alts\xe5 ",(0,i.kt)("a",{parentName:"p",href:"https://_prefiks_-airflow.knada.adeo.no."},"https://_prefiks_-airflow.knada.adeo.no.")," Dette\nkan i grunn settes til hva man vil, men det vanligste har v\xe6rt \xe5 sette det til det samme som namespace navnet."),(0,i.kt)("h3",{id:"user"},"user"),(0,i.kt)("p",null,"List opp de identene som skal ha tilgang til airflow instansen."),(0,i.kt)("h3",{id:"dagsrepo"},"dagsRepo"),(0,i.kt)("p",null,"Repoet under NAVIKT-orgen p\xe5 Github som inneholder Python-filer med DAG-er."),(0,i.kt)("div",{className:"admonition admonition-caution alert alert--warning"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"}))),"repoet m\xe5 eksistere")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"Repoet trenger ikke inneholde noen DAG-er n\xe5r Airflow instansen settes opp, men repoet ",(0,i.kt)("strong",{parentName:"p"},"m\xe5 eksistere"),"."))),(0,i.kt)("p",null,"En gang i minuttet vil DAG-ene som ligger i repoet bli synkronisert til Airflow instansen."),(0,i.kt)("h4",{id:"eksempler-p\xe5-dags-repoer"},"Eksempler p\xe5 DAGs repoer"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/navikt/nada-dags"},"nada-dags")," inneholder en rekke eksempler p\xe5 hvordan \xe5 ta i bruk ulike operators i Airflow."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/navikt/opendata-dags"},"opendata-dags")," er DAG-ene Opendata bruker for \xe5 lage datapakker.")),(0,i.kt)("h3",{id:"dagsrepobranch"},"dagsRepoBranch"),(0,i.kt)("p",null,"Du kan ogs\xe5 spesifisere en branch som Airflow skal synkronisere mot."),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"default:")," main"),(0,i.kt)("h3",{id:"reposynctime"},"repoSyncTime"),(0,i.kt)("p",null,"Hvor ofte (i sekunder) Airflow skal synkronisere mot repoet ditt."),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"default:")," 60"),(0,i.kt)("h3",{id:"dvapiendpoint"},"dvApiEndpoint"),(0,i.kt)("p",null,"Ved datapakke-publisering bruker dataverk denne parameteren for \xe5 sette api-adressen som datakatalogen skal hente\ninnholdet fra for datapakkevisningen."),(0,i.kt)("h3",{id:"dvbucketendpoint"},"dvBucketEndpoint"),(0,i.kt)("p",null,"Ved datapakke-publisering bruker dataverk denne parameteren for \xe5 avgj\xf8re hvilken datakatalog som innholdet i\ndatapakken (ressursfiler og visualiseringer) skal publiseres til."),(0,i.kt)("div",{className:"admonition admonition-caution alert alert--warning"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"}))),"ekstern publisering")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"Dersom man ikke spesifiserer ",(0,i.kt)("inlineCode",{parentName:"p"},"dvApiEndpoint")," og ",(0,i.kt)("inlineCode",{parentName:"p"},"dvBucketEndpoint")," vil datapakker publiseres til den\ninterne datakatalogen. Den ",(0,i.kt)("em",{parentName:"p"},"eneste")," grunnen til \xe5 endre disse parameterene er dersom man \xf8nsker \xe5 publisere\ndatapakker fra AirFlow til den \xe5pne datakatalogen data.nav.no.\nMerk ogs\xe5 at dersom disse parameterene f\xf8rst settes til ekstern publisering s\xe5 vil alle datapakker som publiseres fra denne AirFlow-instansen v\xe6re\n\xe5pent tilgjengelig fra internett."))),(0,i.kt)("h2",{id:"dataverk-airflow"},"Dataverk-Airflow"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://github.com/navikt/dataverk-airflow"},"Dataverk-Airflow")," er et wrapperbibliotek som gj\xf8r det enklere \xe5\nbruke ",(0,i.kt)("a",{parentName:"p",href:"https://airflow.apache.org/docs/apache-airflow/stable/kubernetes.html"},"KubernetesPodOperator")," i KNADA clusteret."),(0,i.kt)("p",null,"Biblioteket inneholder wrapper-funksjoner for \xe5 kj\xf8re Jupyter notebooks, Python scripts, BigQuery kommandoer og\nDBT transformasjoner i separate Kubernetes pod-er. Se ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/navikt/dataverk-airflow/blob/master/README.md"},"README"),"\np\xe5 repoet for eksempler."))}m.isMDXComponent=!0},2443:function(e,t,n){t.Z=n.p+"assets/images/dag-eksempel-ffe2b3c0ef8bdc07bda16dfc3db6d28e.png"}}]);