/**
 * Seminar 2.1 Blockchain primitive
 */

const SHA256 = require('ethereum-cryptography/sha256').sha256;
const utf8ToBytes = require('ethereum-cryptography/utils').utf8ToBytes;
const toHex = require('ethereum-cryptography/utils').toHex; // Добавим для удобства просмотра хэшей

class Block {
    constructor(data) {
        this.data = data; // Here we simplify data, let it be just a simple string
        this.previousHash = null;
    }

    // Вычисляет хэш, который будет использоваться как собственный хэш блока.
    // Обратите внимание: класс Block не хранит собственный хэш явно в поле, 
    // он вычисляется по требованию.
    toHash() {
        // Конкатенируем данные и previousHash
        const dataToHash = this.data + this.previousHash; 
        const hashBytes = utf8ToBytes(dataToHash);
        
        // Возвращаем хэш в виде массива байтов (как требуется в задании)
        return SHA256(hashBytes); 
    }
}


class Blockchain {
    constructor() {
        this.chain = [
            /* TODO 1: Create the genesis block here */
            this.createGenesisBlock()
        ];
    }

    /**
     * Задание 1.1: Создание генезис-блока
     */
    createGenesisBlock() {
        const genesisBlock = new Block("Genesis Block");
        // У генезис-блока нет предыдущего хэша, устанавливаем его в "0"
        // для обеспечения детерминированности собственного хэша.
        genesisBlock.previousHash = "0"; 
        return genesisBlock;
    }

    /**
     * Получает последний блок в цепочке.
     */
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    /**
     * Задание 1.2: Добавление нового блока
     */
    addBlock(block) {
        // Получаем хэш последнего блока, который станет previousHash для нового блока
        const previousBlock = this.getLatestBlock();
        // Необходимо преобразовать byte[] хэш предыдущего блока в строку (или Hex),
        // чтобы его можно было конкатенировать с data при вычислении хэша нового блока (в toHash()).
        // Используем toHex() для string-совместимости, если требуется строковая конкатенация.
        block.previousHash = toHex(previousBlock.toHash()); 

        this.chain.push(block);
    }

    /**
     * Задание 1.3: Проверка валидности цепочки
     */
    isValid() {
        // 
        // Проверяем все блоки, начиная со второго (индекс 1), так как
        // генезис-блок (индекс 0) не имеет предыдущего блока.
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // 1. Проверка того, что previousHash текущего блока совпадает с 
            // хэшем, который должен быть у предыдущего блока
            const expectedPreviousHash = toHex(previousBlock.toHash());
            if (currentBlock.previousHash !== expectedPreviousHash) {
                console.log(`[Validation Error] Block ${i}: previousHash link is broken. Expected ${expectedPreviousHash}, got ${currentBlock.previousHash}`);
                return false;
            }

            // 2. Проверка того, что собственный хэш текущего блока был вычислен корректно
            // (т.е., что его данные не были изменены)
            const calculatedHash = toHex(currentBlock.toHash());
            // Если в toHash() не храним хэш явно, а пересчитываем, то это достаточная проверка
            
            // Если мы решили хранить хэш в блоке явно, то нужно сравнить:
            // if (calculatedHash !== storedHash) return false;
            
            // В данной реализации, поскольку toHash() пересчитывает хэш на основе
            // this.data и this.previousHash, и мы уже проверили this.previousHash,
            // можно считать, что достаточно проверить связь с предыдущим блоком. 
            // Однако, для полной безопасности блокчейна, мы должны убедиться, что
            // данные блока не были изменены. Поскольку мы не храним хэш явно в классе Block,
            // проверка 'previousHash' против 'previousBlock.toHash()' уже гарантирует,
            // что хэш, используемый в currentBlock.previousHash, корректен.

            // Для полноты, в реальных блокчейнах обычно хранится явное поле 'hash'.
            // Если бы мы хранили this.hash в конструкторе, проверка была бы:
            // if (toHex(currentBlock.hash) !== calculatedHash) {
            //     console.log(`[Validation Error] Block ${i}: self-hash is incorrect.`);
            //     return false;
            // }
        }

        // Отдельно проверяем генезис-блок (индекс 0), хотя он не имеет предыдущего хэша для сравнения,
        // но его 'previousHash' должен быть "0".
        if (this.chain[0].previousHash !== "0") {
             console.log(`[Validation Error] Genesis Block has wrong previousHash.`);
             return false;
        }

        return true;
    }
}

module.exports = { Block, Blockchain, toHex }; // Экспортируем toHex для удобства тестирования