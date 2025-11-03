import { LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getDomainConfig } from '../../utils/domainConfig'
// import Logo from '../../assets/4js-logo.svg'

const Appbar = () => {
  const config = getDomainConfig();

  return (
    <div className='px-4 md:px-6 w-full h-16 flex justify-between items-center bg-secondary border-b border-border'>
      <Link to="/dashboard">
        <img src={config.logo} alt="LADMC-4JS-LOGO" className='h-15' />
        {/* <img src={Logo} alt="LADMC-4JS-LOGO" className='h-15' /> */}
      </Link>
      <button
        type="button"
        onClick={() => {
          localStorage.removeItem('jwtToken');
          window.location.href = '/';
        }}
        className="flex items-center px-4 py-2 gap-3 rounded-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
      >
        <LogOut size={20} />
        Sign out
      </button>
    </div>
  )
}

export default Appbar