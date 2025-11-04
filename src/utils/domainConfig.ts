// import defaultLogo from '../assets/default.svg'
import ladmc from '../assets/4js-logo.svg'
import wcmc from '../assets/default.svg'

interface DomainConfig {
  logo: string;
  title: string;
  reportLogo:string;
  address: string;
}

export const getDomainConfig = (): DomainConfig => {
  const hostname = window.location.hostname;
  console.log(hostname);
  
  // Define domain configurations directly
  if (hostname.includes('ladmc-reports') || hostname.includes('ladmc')) {
    return {
      logo: ladmc,
      title: 'LADMC Reports',
      reportLogo: 'https://ladowntownmc.com/wp-content/uploads/2019/06/copy-of-logo.png',
      address: `1711 West Temple Street <br>
                Los Angeles CA 90026 5421 <br>
                213-989-6100 <br>`
    };
  }
  
  if (hostname.includes('wcmc-reports') || hostname.includes('wcmc')) {
    return {
      logo: wcmc,
      title: 'WCMC Reports',
      reportLogo: 'https://westcovinamc.com/static/media/logo-colored.png',
      address: `725 S  Orange Av <br>
                West Covina  CA 91790<br>
                626-338-8481 <br>`,
    };
  }
  
  // Default configuration
  return {
      logo: ladmc,
      title: 'LADMC Reports',
      reportLogo: 'https://ladowntownmc.com/wp-content/uploads/2019/06/copy-of-logo.png',
      address: `1711 West Temple Street <br>
                Los Angeles CA 90026 5421 <br>
                213-989-6100 <br>`
  };
}

export const useDomainConfig = () => {
  return getDomainConfig();
}
