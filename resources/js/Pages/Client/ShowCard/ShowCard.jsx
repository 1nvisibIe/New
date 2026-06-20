import Layout from "../Layout/Layout.jsx"
import { ImageShow } from "@/Components/Client/ImageShow/ImageShow.jsx"
import "./ShowCard.css"

export default function ShowCard({ card }) {
    const images = card.product?.images ?? []

    return (
        <Layout>
            <main className="show-card">
                <div className="show-card-gallery">
                    <ImageShow images={images} />
                </div>

                <div className="show-card-info">
                    {/* сюда дальше пойдут название, цена, кнопки и т.д. */}
                </div>
            </main>
        </Layout>
    )
}
