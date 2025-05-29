// import {makeAutoObservable} from 'mobx'

// export default class PlaceHome {
//     constructor() {

//         this._types = [
//             {id:1, name: 'Болото'},
//             {id:2, name: 'саванна'}
//         ]

        
//         this._places = [
//             {id:1, name: 'стрелок'},
//             {id:2, name: 'мечник'},
//         ]

//         this._selectedType = {}
//         this._page = 1
//         this._totalCount = 0
//         this._limit = 6
//         makeAutoObservable(this)
//     }


    

//     setPlaces(places) {
//         this._places = places
//     }

//     setTypes(types) {
//         this._types = types
//     }

//     setSelectedType(type) {
//         this.setPage(1)
//         this._selectedType = type
//     }

//     setPage(page) {
//         this._page = page
//     }

//     setTotalCount(totalCount) {
//         this._totalCount = totalCount
//     }

    

//     get places() {
//             return this._places
//         }
//     get types() {
//         return this._types
//     }

//     get selectedType() {
//         return this._selectedType
//     }

//     get page() {
//         return this._page
//     }

//     get totalCount() {
//         return this._totalCount
//     }

//     get limit() {
//         return this._limit
//     }

// }