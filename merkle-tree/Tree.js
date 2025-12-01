/**
 * Seminar 2.3 Binary search tree
 */

class Node {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}


class Tree {
    constructor() {
        this.root = null;
    }

    /**
     * Задание 3.1: Добавление узла (addNode)
     * !!! ИСПРАВЛЕНО: Теперь принимает объект Node, как того требует тест.
     */
    addNode(newNode){ // Принимает newNode (объект Node), а не просто число data
        // 1. Если дерево пустое, новый узел становится корнем.
        if (this.root === null) {
            this.root = newNode;
            return;
        }

        let current = this.root;
        const data = newNode.data; // Извлекаем данные для сравнения

        while (true) {
            if (data < current.data) {
                // Идем влево (меньше)
                if (current.left === null) {
                    // Найдено место: привязываем переданный узел
                    current.left = newNode;
                    return; 
                }
                current = current.left;
            } else if (data > current.data) {
                // Идем вправо (больше)
                if (current.right === null) {
                    // Найдено место: привязываем переданный узел
                    current.right = newNode;
                    return; 
                }
                current = current.right;
            } else {
                // Игнорируем дубликаты
                return; 
            }
        }
    }

    /**
     * Задание 3.2: Проверка наличия узла (hasNode)
     * Этот метод остается без изменений, так как он был правильным.
     */
    hasNode(data){
        let current = this.root;
        
        while (current !== null) {
            if (data === current.data) {
                return true; 
            } else if (data < current.data) {
                current = current.left;
            } else { 
                current = current.right; 
            }
        }
        
        return false;
    }
}


module.exports = { Node, Tree }