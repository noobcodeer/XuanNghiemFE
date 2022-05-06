export default function checkPosition(place, store, idSmall) {
    if (store.placeStatus === "IN_FACTORY" && store.current.userRole === "Deliver") {
        let text = "Kho trực thuộc : " + store.current.name;
        return text;
    }
    else if (store.placeStatus === "IN_FACTORY" && store.current.userRole === "Owner" && store.warehouseType === "EMPTY") {
        let text = "Kho Vỏ - " + store.current.name;
        return text;
    }
    else if (store.placeStatus === "IN_FACTORY" && store.current.userRole === "Owner" && store.warehouseType === "FULL") {
        let text = "Kho Thành Phẩm  -" + store.current.name;
        return text;
    }
    else if (store.placeStatus === "IN_FACTORY" && store.current.userRole === "Owner") {
        let text = "Tại: " + store.current.name;
        return text;
    }
    else if (store.placeStatus === "DELIVERING") {
        let index = place.findIndex(p => p.key === store.placeStatus);
        return place[index].value + ": " + store.current.name;
    }
    else if (store.placeStatus === "IN_CUSTOMER") {
        let index = place.findIndex(p => p.key === store.placeStatus);
        return place[index].value + ": " + store.current.name;
    }
    else if (store.placeStatus === "IN_GENERAL" && store.current.customerType === "Distribution_Agency") {
        //let index = place.findIndex(p => p.key === store.placeStatus);
        //return place[index].value + ": " + store.current.name;
        return store.current.name;
    }
    else if (store.placeStatus === "IN_GENERAL" && store.current.customerType === "Level_2_Agency") {
        //let index = place.findIndex(p => p.key === store.placeStatus);
        //return place[index].value + ": " + store.current.name;
        return store.current.name;
    }
    else if (store.placeStatus === "IN_GENERAL" && store.current.customerType === "Level_1_Agency") {
        //let index = place.findIndex(p => p.key === store.placeStatus);
        //return place[index].value + ": " + store.current.name;
        return store.current.name;
    }
    else if (store.placeStatus === "IN_GENERAL" && store.current.customerType === "Industry") {
        //let index = place.findIndex(p => p.key === store.placeStatus);
        //return place[index].value + ": " + store.current.name;
        return store.current.name;
    }
    else if(store.placeStatus === "IN_AGENCY"){
        if (store.current.isChildOf_name){
            return store.current.isChildOf_name + " - "+ store.current.name
        }
       return store.current.name;
    }
    else {
        let index = place.findIndex(p => p.key === store.placeStatus);
        return place[index].value;
    }
}