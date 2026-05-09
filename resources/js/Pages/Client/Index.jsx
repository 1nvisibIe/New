import {Link, router} from '@inertiajs/react'
import {CardImage} from "@/Components/Client/CardImage.jsx";
import "./Index.css"

export default function Index({cards}) {
    return (
        <main>
            {cards.data.length > 0 ? (
                <div className={"card-wrapper card-flex"}>
                    <div className={"card-layout"}>
                        {cards.data.map(cards => (
                            <CardImage key={cards.id} cards={cards}/>))}
                    </div>
                </div>
            ) : (
                <div className="px-6 py-12 text-center text-gray-400 text-sm">
                    Товаров пока нет
                </div>
            )}

        </main>
    )

}
