import ProductSegment from "./products/ProductSegment.tsx";

const WelcomeComponent = () => {

    const currentMonth = new Date().getMonth() + 1;

    return (
        <div style={{marginTop: "150px"}}>
            <ProductSegment
                title={`Laptop Hot Tháng ${currentMonth}`}
                categoryId={"0e122d77-bd1c-4602-805b-01bc00a4cfab"}
                size={8}
                canLoadMore={false}
                button={{
                    show: true,
                    title: "Xem tất cả",
                    navigateToCategoryId: "0e122d77-bd1c-4602-805b-01bc00a4cfab"
                }}
            />

            <ProductSegment
                title={`Điện Thoại Hot Tháng ${currentMonth}`}
                categoryId={"16dbc98c-d6c6-449f-901a-e89b4c1bf612"}
                size={8}
                canLoadMore={false}
                button={{
                    show: true,
                    title: "Xem tất cả",
                    navigateToCategoryId: "16dbc98c-d6c6-449f-901a-e89b4c1bf612"
                }}
            />

            <ProductSegment
                title={`Đồng Hồ Thông Minh Xịn`}
                categoryId={"30a44fc3-c9c5-478d-8aa8-e040e9d67bdc"}
                size={8}
                canLoadMore={false}
                button={{
                    show: true,
                    title: "Xem tất cả",
                    navigateToCategoryId: "30a44fc3-c9c5-478d-8aa8-e040e9d67bdc"
                }}
            />
        </div>
    );
};

export default WelcomeComponent;
