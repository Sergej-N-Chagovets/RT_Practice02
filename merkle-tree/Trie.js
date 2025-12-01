/**
 * Seminar 2.5 Simple Trie
 */

class TrieNode {
    constructor(key) {
        // Ключ (символ) узла. Для корня = null.
        this.key = key; 
        // Объект для хранения дочерних узлов, где ключ — это следующий символ.
        this.children = {}; 
        // Флаг, указывающий, завершается ли в этом узле полноценное слово.
        this.isWord = false; 
    }
}


class Trie {
    constructor() {
        this.root = new TrieNode(null);
    }

    /**
     * Задание: Вставить слово, символ за символом
     * @param {string} word 
     */
    insert(word) {
        let current = this.root;
        
        // 1. Проходим по каждому символу в слове
        for (const char of word) {
            // 2. Если символ (ключ) не существует среди дочерних элементов текущего узла,
            // создаем новый TrieNode.
            if (!current.children[char]) {
                current.children[char] = new TrieNode(char);
            }
            
            // 3. Переходим к следующему узлу (дочернему элементу)
            current = current.children[char];
        }
        
        // 4. Помечаем последний узел как завершение слова
        current.isWord = true;
    }

    /**
     * Задание: Проверить, содержится ли слово в Trie
     * @param {string} word 
     * @returns {boolean}
     */
    hasNode(word){
        let current = this.root;
        
        // 1. Проходим по каждому символу в слове
        for (const char of word) {
            // 2. Если символ не найден, слово не существует
            if (!current.children[char]) {
                return false;
            }
            
            // 3. Переходим к следующему узлу
            current = current.children[char];
        }
        
        // 4. Слово считается найденным только в том случае, если
        // мы дошли до конца и последний узел помечен как isWord
        return current.isWord;
    }

    /**
     * Задание: Вернуть все узлы как массив (обход в ширину)
     * В реальном мире, обычно возвращают сами слова, а не узлы.
     * Здесь реализуем возврат всех узлов, используя обход в ширину (BFS).
     * @returns {Array<TrieNode>}
     */
    getAllNodes(){
        const nodes = [];
        // Используем очередь для BFS
        const queue = [this.root]; 
        
        // 

        while (queue.length > 0) {
            const current = queue.shift();
            
            // Не добавляем корневой узел (key = null) в список, если он не нужен
            // Если требуется включить корень: nodes.push(current);
            if (current.key !== null) {
                 nodes.push(current);
            }
            
            // Добавляем всех дочерних элементов в очередь
            for (const key in current.children) {
                queue.push(current.children[key]);
            }
        }
        
        return nodes;
    }
}

module.exports = { Trie };