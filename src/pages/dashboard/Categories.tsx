import { Link } from "react-router-dom"

interface Category {
    name: string,
    description: string,
    path: string
}
export const Categories = () => {
    const category: Category[] = [
        { name: "Category 1", description: "Description for Category 1.", path:'/report' },
        { name: "Category 2", description: "Description for Category 2.", path:'/report' },
        { name: "Category 3", description: "Description for Category 3.", path:'/report' },
        { name: "Category 4", description: "Description for Category 4.", path:'/report' },
    ]
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {category.map((cat, index) => (
            <Link key={index} to={cat.path} className="p-4 h-[46dvh] relative bg-secondary border border-border  rounded-lg">
                <div className="p-4 absolute bottom-4 left-4 right-4 bg-background rounded-lg">
                    <h2 className="text-xl font-semibold">{cat.name}</h2>
                    <p className="text-muted-foreground">{cat.description}</p>
                </div>
            </Link>
        ))}
    </div>
  )
}
