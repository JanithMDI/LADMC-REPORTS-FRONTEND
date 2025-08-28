import Appbar from '../../components/ui/appbar'
import { Categories } from './Categories'

export const Dashboard = () => {
  return (
    <>
        <main>
            <Appbar/>
            <section className='p-4 md:p-6'>
                <Categories/>
            </section>
        </main>
    </>
  )
}
