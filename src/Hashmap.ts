class Bucket{
    key: string;
    value: string | null;
    next: Bucket | null;

    constructor(key: string, value: string | null = null, next: Bucket | null = null ) {
       this.key = key;
       this.value = value;
       this.next = next;
    }
}


export class Hashmap{
    loadFactor: number;
    capacity: number;
    storage: any[];

   constructor(loadFactor :number = 0.8, capacity :number = 16) {
       this.storage = new Array(capacity);
       this.loadFactor = loadFactor;
       this.capacity = capacity;
   }

    hash(key:string){
        let hashCode = 0;

        const primeNumber = 31;
        for (let i = 0; i < key.length; i++){
            hashCode = primeNumber * hashCode + key.charCodeAt(i);
            hashCode %= this.capacity;
        }

        return hashCode;
    }

    set(key:string, value:string){
       let keyHash = this.hash(key);

       if (keyHash < 0 || keyHash >= this.storage.length) {
          throw new Error("Trying to access index out of bounds");
        }

       if (this.storage[keyHash]){
           let bucket :Bucket = this.storage[keyHash];
           if (bucket.key === key){
               bucket.value = value;
           } else {
               bucket.next = new Bucket(key, value);
           }
       } else {
          this.storage[keyHash] = new Bucket(key, value);
       }

       this.enlargeBucket()
    }

    get(key:string) :string | null{
      let keyHash = this.hash(key);

      if (keyHash < 0 || keyHash >= this.storage.length) {
         throw new Error("Trying to access index out of bounds");
      }

      if (this.storage[keyHash]){
          let item: Bucket = this.storage[keyHash];
          while (item.key != key){
              if (item.next == null){return null}
              item = item.next;
          }
          return item.value
      } else {
          return null;
      }
    }

    has(key:string) :boolean{
        return null != this.get(key);
    }

    remove(key:string) :boolean{
        let keyHash = this.hash(key);

        if (keyHash < 0 || keyHash >= this.storage.length) {
            throw new Error("Trying to access index out of bounds");
        }

        if (this.storage[keyHash]){
            let item: Bucket = this.storage[keyHash];
            let prevItem: Bucket;
            let counter = 0;

            while (item.key != key){
                if (item.next == null){return false}
                prevItem = item
                item = item.next;
                counter ++;
            }
            if (item.next === null && counter == 0){
               this.storage.splice(counter, 1);
            } else if (item.next === null){
                // @ts-ignore
                prevItem.next = null;
            }
            else {
                // @ts-ignore
                prevItem.next = item.next;
            }
            return true;
        } else {
            return false;
        }
    }

    length() :number{
       let counter = 0;
       for(let i = 0; i < this.storage.length; i++){
           let bucket :Bucket = this.storage[i];
           if (bucket){
               counter++;
               while(bucket.next){
                   bucket = bucket.next
                   counter++;
               }
           }
       }

       return counter;
    }

    clear(){
       const defaultArrayLength = 16;
       const defaultArrayFactor = 0.8;

       this.storage = new Array(defaultArrayLength);
       this.loadFactor = defaultArrayFactor;
       this.capacity = defaultArrayLength;
    }

    keys() :string[] {
        let keysArray = [];
        for(let i = 0; i < this.storage.length; i++){
            let bucket :Bucket = this.storage[i];
            if (bucket){
                keysArray.push(bucket.key)
                while(bucket.next){
                    bucket = bucket.next
                    keysArray.push(bucket.key)
                }
            }
        }

        return keysArray;
    }

    values() {
        let valuesArray= [];
        for(let i = 0; i < this.storage.length; i++){
            let bucket :Bucket = this.storage[i];
            if (bucket){
                valuesArray.push(bucket.value)
                while(bucket.next){
                    bucket = bucket.next
                    valuesArray.push(bucket.value)
                }
            }
        }

        return valuesArray;

    }

    entries(){
        let entriesArray= [];
        for(let i = 0; i < this.storage.length; i++){
            let bucket :Bucket = this.storage[i];
            if (bucket){

                entriesArray.push([bucket.key, bucket.value])
                while(bucket.next){
                    bucket = bucket.next
                    entriesArray.push(bucket.key, bucket.value)
                }
            }
        }

        return entriesArray;

    }

    enlargeBucket(){
      let transformationFactor = this.capacity * this.loadFactor;
      if (this.length() >= transformationFactor){
            this.capacity *= 2;
            let newStorage = new Array(this.capacity);

            for (let i = 0; i < this.storage.length; i++) {
                newStorage[i] = this.storage[i];
            }

            this.storage = newStorage;
      }
    }

}