/**
 * Seminar 2.2 Transaction output
 */

const SHA256 = require('ethereum-cryptography/sha256').sha256;
const utf8ToBytes = require('ethereum-cryptography/utils').utf8ToBytes;
const toHex = require('ethereum-cryptography/utils').toHex; // Используем для преобразования хэша в строку

class Transaction {
    
    /**
     * Задание 2.1: Инициализация полей транзакции
     */
    constructor(from, to, value) {
        this.from = from;
        this.to = to;
        this.value = value;
        // Поле 'spent' инициализируется как false
        this.spent = false; 
        // Хэш вычисляется при создании
        this.hash = this.calculateHash();
    }
    
    /**
     * Вычисляет хэш транзакции от конкатенации from, to и value.
     * Возвращает хэш в виде строки (Hex).
     */
    calculateHash() {
        // Конкатенируем данные для хэширования
        const dataToHash = this.from + this.to + this.value.toString();
        const hashBytes = utf8ToBytes(dataToHash);
        
        // Хэшируем и возвращаем результат в виде Hex-строки
        return toHex(SHA256(hashBytes)); 
    }

    /**
     * Задание 2.2: Реализация метода spend()
     */
    spend() {
        // Проверяем, была ли транзакция уже потрачена
        if (this.spent) {
            // Если да, выбрасываем ошибку
            throw new Error('Already spended!'); 
        }
        
        // Если нет, устанавливаем флаг в true
        this.spent = true;
    }
}

module.exports = { Transaction }