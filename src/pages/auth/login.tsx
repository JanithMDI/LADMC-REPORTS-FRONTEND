import { LoginForm } from './LoginForm'
import { getDomainConfig } from '../../utils/domainConfig'
// import Logo from '../../assets/4js-logo.svg'

export const Login = () => {
  const config = getDomainConfig();

  return (
    <>
        <div className='p-6 w-full flex  items-center'>
            {/* <img src={Logo} alt="LADMC-4JS-LOGO" className='h-15'/> */}
            <img src={config.logo} alt="LADMC-4JS-LOGO" className='h-15'/>
        </div>
        <div className='p-6 md:p-0 w-full md:w-[356px] mt-10 mx-auto flex flex-col gap-8'>
            <h1 className='text-3xl font-semibold capitalize'>Sign in</h1>
            <LoginForm />
        </div>
    </>
  )
}
