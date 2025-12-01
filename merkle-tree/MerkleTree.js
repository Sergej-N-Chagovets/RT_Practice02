/**
 * Seminar 2.4 Simple Merkle Tree
 */


function concatHashes(a, b) {
    // В реальной жизни здесь использовалась бы криптографическая хэш-функция, 
    // например, SHA256(SHA256(a) + SHA256(b))
    return `Hash(${a} + ${b})`;
} 

class MerkleTree {
    constructor(leaves) {
        this.leaves = leaves;
        // Задание: Вычислить корень при создании
        this.root = this.getRoot(leaves);
    }

    /** * Рекурсивно, послойно конкатенирует хэши.
     * Возвращает: Merkle root
     */
    getRoot(leaves){
        if (leaves.length === 1) {
            return leaves[0];
        }
        else {
            const nextLayer = [];
            for (let i = 0; i < leaves.length; i += 2) {
                const l1 = leaves[i];
                const l2 = leaves[i+1];
                
                if (l2) {
                    // Конкатенация двух соседних узлов
                    nextLayer.push(concatHashes(l1, l2));
                } else {
                    // Если узел нечетный, он поднимается сам по себе (или удваивается)
                    // В этой упрощенной реализации, он просто поднимается.
                    nextLayer.push(l1); 
                }
            }
            return this.getRoot(nextLayer);
        }
    }

    /** * Merkle proof (Доказательство Меркла)
     * Возвращает: цепочку дополнительных хэшей, необходимых для построения корня.
     * Формат: [{hash: string, left: boolean}, ...]
     */
    getProof(index, layer = this.leaves, proof = []) {
        if (layer.length === 1) return proof;
        const newLayer = [];

        // 1. Построение следующего слоя и одновременное нахождение комплементарного хэша
        for (let i = 0; i < layer.length; i += 2) {
            let left = layer[i];
            let right = layer[i + 1];
            
            // Обработка нечетного количества элементов
            if (!right) {
                newLayer.push(left);
            }
            else {
                newLayer.push(concatHashes(left, right));
                
                // 2. Проверка, находится ли искомый индекс в этой паре
                if (i === index || (i + 1) === index) {
                    // Искомый элемент - левый (индекс четный)
                    let isLeftLeaf = (index % 2) === 0;
                    
                    proof.push({
                        // Добавляем противоположный узел
                        hash: isLeftLeaf ? right : left,
                        // 'left' указывает, что комплементарный хэш находится слева от нашего узла
                        left: !isLeftLeaf
                    });
                }
            }
        }
        // Рекурсивный переход к следующему слою с новым индексом
        return this.getProof(Math.floor(index / 2), newLayer, proof);
    }
}

/**
 * Задание: Проверка доказательства Меркла
 * @param {Array<{hash: string, left: boolean}>} proof - Цепочка комплементарных хэшей.
 * @param {string} nodeHash - Хэш проверяемого узла.
 * @param {string} rootHash - Ожидаемый корневой хэш.
 * @returns {boolean} - true, если хэш-цепочка соответствует корневому хэшу.
 */
function verifyProof(proof, nodeHash, rootHash) {
    let computedHash = nodeHash;

    // Итерация по каждому хэшу в доказательстве
    for (const p of proof) {
        // Указывает, находится ли комплементарный хэш слева от нашего
        if (p.left) {
            // Структура: Hash(p.hash + computedHash) 
            // (т.к. наш узел находится справа)
            computedHash = concatHashes(p.hash, computedHash);
        } else {
            // Структура: Hash(computedHash + p.hash) 
            // (т.к. наш узел находится слева)
            computedHash = concatHashes(computedHash, p.hash);
        }
    }

    // Сравнение полученного корневого хэша с ожидаемым
    return computedHash === rootHash;
}


module.exports = { MerkleTree, verifyProof }