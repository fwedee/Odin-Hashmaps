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
        }

        return hashCode % this.capacity;
    }

    set(key:string, value:string){
       let keyHash = this.hash(key);

       if (keyHash < 0 || keyHash >= this.storage.length) {
          throw new Error("Trying to access index out of bounds");
        }

       if (this.storage[keyHash]){
           let currentBucket :Bucket = this.storage[keyHash];
           while (true){
               if (currentBucket.key === key){
                   currentBucket.value = value;
                   break;
               }
               if (!currentBucket.next) {
                   currentBucket.next = new Bucket(key, value);
                   break;
               }
               currentBucket = currentBucket.next;
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
        const keyHash = this.hash(key);

        if (keyHash < 0 || keyHash >= this.storage.length) {
            throw new Error("Trying to access index out of bounds");
        }

        let bucket = this.storage[keyHash];

        if (!bucket){
            return false;
        }

        if (bucket.key === key){
            this.storage[keyHash] = bucket.next;
            return true;
        }

        let prev = bucket;
        let current = bucket.next;

        while (current){
            if (current.key === key){
                prev.next = current.next;
                return true;
            }
            prev = current;
            current = current.next;
        }

        return false;
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
                    entriesArray.push([bucket.key, bucket.value])
                }
            }
        }

        return entriesArray;

    }

    enlargeBucket(){
      let transformationFactor = this.capacity * this.loadFactor;
      if (this.length() >= transformationFactor){
            this.capacity *= 2;
            const oldStorage = this.storage;
            let newStorage = new Array(this.capacity);

            for (let i = 0; i < oldStorage.length; i++) {
                let bucket: Bucket | null = oldStorage[i];
            while (bucket) {
            const newIndex = this.hash(bucket.key) % this.capacity;
            if (!newStorage[newIndex]) {
                newStorage[newIndex] = new Bucket(bucket.key, bucket.value);
            } else {
                let current = newStorage[newIndex];
                while (current.next) current = current.next;
                current.next = new Bucket(bucket.key, bucket.value);
            }
            bucket = bucket.next;
            }
            }
      }
    }

}