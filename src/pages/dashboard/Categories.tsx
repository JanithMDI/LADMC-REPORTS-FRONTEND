import { Link } from "react-router-dom"
import ImgItemizedBill from '../../assets/bg-1.png'
import ImgStatPoolClassic from '../../assets/bg-2.png'
import ImgStatPoolPayor from '../../assets/bg-3.png'
import ImgCoreMeasures from '../../assets/bg-4.png'

interface Category {
    title: string,
    img: string,
    path: string
}
export const Categories = () => {
    const category: Category[] = [
        { title: "Itemized Bill", img: ImgItemizedBill, path:'/report/bill' },
        { title: "Stat Pool-Classic", img: ImgStatPoolClassic, path:'/report/report' },
        { title: "Stat Pool-Payor", img: ImgStatPoolPayor,  path:'/report/payor' },
        { title: "Payment By Transaction Type", img: ImgCoreMeasures,  path:'/payment-by-transaction-type' },
        { title: "Adjustment By Transaction Type", img: ImgCoreMeasures,  path:'/adjustment-by-transaction-type' },
        { title: "Inp Charity", img: ImgCoreMeasures,  path:'/inp-charity' },
        // { title: "Core Measures", img: ImgCoreMeasures,  path:'/report/category4' },
        // { title: "Core Measures", img: ImgCoreMeasures,  path:'/report/category4' },
        // { title: "Core Measures", img: ImgCoreMeasures,  path:'/report/category4' },
    ]
  return (
    <div className="w-[60dvw] mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        {category.map((cat, index) => (
            <Link key={index} to={cat.path} className="p-4 h-[26dvh]  relative bg-secondary border border-border overflow-hidden rounded-lg">
                <img src={cat.img} className="absolute h-full w-full top-0 left-0 object-cover" alt={cat.title} />
                <div className="p-4 absolute bottom-4 left-4 ">
                    <h1 className="text-xl md:text-2xl text-white font-semibold">{cat.title}</h1>
                </div>
            </Link>
        ))}
    </div>
  )
}