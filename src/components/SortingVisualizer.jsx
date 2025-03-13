import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const SortingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [speed, setSpeed] = useState(100);
  const [size, setSize] = useState(10);
  const [algorithm, setAlgorithm] = useState("bubbleSort");
  const [activeIndices, setActiveIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [userArray, setUserArray] = useState("");
  const stopSorting = useRef(false);

  // Generate random array
  const generateArray = () => {
    if (isSorting) return;
    const newArray = Array.from(
      { length: size },
      () => Math.floor(Math.random() * 100) + 1
    );
    setArray(newArray);
    setActiveIndices([]);
    setSortedIndices([]);
  };

  useEffect(() => generateArray(), [size]);

  // Sorting algorithms
  const bubbleSort = async () => {
    setIsSorting(true);
    stopSorting.current = false;
    let arr = [...array];
    let n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (stopSorting.current) return cleanup();
        setActiveIndices([j, j + 1]);

        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
        }
        await delay();
      }
      setSortedIndices((prev) => [...prev, n - i - 1]);
    }
    cleanup();
  };

  const selectionSort = async () => {
    setIsSorting(true);
    stopSorting.current = false;
    let arr = [...array];
    let n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;
      for (let j = i + 1; j < n; j++) {
        if (stopSorting.current) return cleanup();
        setActiveIndices([i, j]);

        if (arr[j] < arr[minIndex]) minIndex = j;
        await delay();
      }
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      setArray([...arr]);
      setSortedIndices((prev) => [...prev, i]);
    }
    cleanup();
  };

  const insertionSort = async () => {
    setIsSorting(true);
    stopSorting.current = false;
    let arr = [...array];
    let n = arr.length;

    for (let i = 1; i < n; i++) {
      let key = arr[i];
      let j = i - 1;

      while (j >= 0 && arr[j] > key) {
        if (stopSorting.current) return cleanup();
        setActiveIndices([j, j + 1]);
        arr[j + 1] = arr[j];
        setArray([...arr]);
        await delay();
        j--;
      }
      arr[j + 1] = key;
      setSortedIndices((prev) => [...prev, i]);
    }
    cleanup();
  };

  const quickSort = async () => {
    setIsSorting(true);
    stopSorting.current = false;
    let arr = [...array];

    const partition = async (low, high) => {
      const pivot = arr[high];
      let i = low - 1;

      for (let j = low; j < high; j++) {
        if (stopSorting.current) return cleanup();
        setActiveIndices([j, high]);

        if (arr[j] < pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          setArray([...arr]);
          await delay();
        }
      }
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      setArray([...arr]);
      await delay();
      return i + 1;
    };

    const performSort = async (low, high) => {
      if (low < high) {
        const pi = await partition(low, high);
        await performSort(low, pi - 1);
        await performSort(pi + 1, high);
      }
    };

    await performSort(0, arr.length - 1);
    cleanup();
  };

  const heapSort = async () => {
    setIsSorting(true);
    stopSorting.current = false;
    let arr = [...array];
    const n = arr.length;

    const heapify = async (size, root) => {
      let largest = root;
      const left = 2 * root + 1;
      const right = 2 * root + 2;

      if (left < size && arr[left] > arr[largest]) largest = left;
      if (right < size && arr[right] > arr[largest]) largest = right;

      if (largest !== root) {
        [arr[root], arr[largest]] = [arr[largest], arr[root]];
        setActiveIndices([root, largest]);
        setArray([...arr]);
        await delay();
        await heapify(size, largest);
      }
    };

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) await heapify(n, i);
    for (let i = n - 1; i > 0; i--) {
      [arr[0], arr[i]] = [arr[i], arr[0]];
      setArray([...arr]);
      await delay();
      await heapify(i, 0);
    }
    cleanup();
  };

  const mergeSort = async () => {
    setIsSorting(true);
    stopSorting.current = false;
    let arr = [...array];

    const merge = async (l, m, r) => {
      const left = arr.slice(l, m + 1);
      const right = arr.slice(m + 1, r + 1);
      let i = 0,
        j = 0,
        k = l;

      while (i < left.length && j < right.length) {
        if (stopSorting.current) return cleanup();
        setActiveIndices([l + i, m + 1 + j]);

        if (left[i] <= right[j]) {
          arr[k++] = left[i++];
        } else {
          arr[k++] = right[j++];
        }
        setArray([...arr]);
        await delay();
      }

      while (i < left.length) {
        arr[k++] = left[i++];
        setArray([...arr]);
        await delay();
      }

      while (j < right.length) {
        arr[k++] = right[j++];
        setArray([...arr]);
        await delay();
      }
    };

    const performSort = async (l, r) => {
      if (l >= r) return;
      const m = Math.floor((l + r) / 2);
      await performSort(l, m);
      await performSort(m + 1, r);
      await merge(l, m, r);
    };

    await performSort(0, arr.length - 1);
    cleanup();
  };

  // Helper functions
  const delay = () => new Promise((resolve) => setTimeout(resolve, speed));
  const cleanup = () => {
    setIsSorting(false);
    setActiveIndices([]);
    setSortedIndices(
      Array(array.length)
        .fill()
        .map((_, i) => i)
    );
    stopSorting.current = false;
  };

  const handleCustomArray = () => {
    try {
      const newArray = userArray.split(",").map(Number);
      if (newArray.some(isNaN)) throw new Error();
      setArray(newArray);
      setSortedIndices([]);
      setActiveIndices([]);
    } catch {
      alert("Please enter valid numbers separated by commas!");
    }
  };

  const getBarHeight = (value) => {
    const max = Math.max(...array);
    return max ? (value / max) * 200 : 0;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        Sorting Visualizer
      </h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <input
          type="text"
          value={userArray}
          onChange={(e) => setUserArray(e.target.value)}
          placeholder="Custom array (comma separated)"
          className="px-3 py-2 rounded bg-gray-700 w-64"
          disabled={isSorting}
        />
        <button
          onClick={handleCustomArray}
          className="px-4 py-2 bg-purple-600 rounded disabled:opacity-50"
          disabled={isSorting}
        >
          Load Custom
        </button>

        <div className="flex items-center gap-2">
          <span>Size:</span>
          <input
            type="range"
            min="5"
            max="50"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="w-32"
            disabled={isSorting}
          />
          <span>{size}</span>
        </div>

        <div className="flex items-center gap-2">
          <span>Speed:</span>
          <input
            type="range"
            min="10"
            max="1000"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
            className="w-32"
            disabled={isSorting}
          />
          <span>{speed}ms</span>
        </div>

        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          className="px-4 py-2 bg-gray-700 rounded"
          disabled={isSorting}
        >
          <option value="bubbleSort">Bubble Sort</option>
          <option value="selectionSort">Selection Sort</option>
          <option value="insertionSort">Insertion Sort</option>
          <option value="quickSort">Quick Sort</option>
          <option value="heapSort">Heap Sort</option>
          <option value="mergeSort">Merge Sort</option>
        </select>

        <button
          onClick={generateArray}
          className="px-4 py-2 bg-blue-600 rounded disabled:opacity-50"
          disabled={isSorting}
        >
          New Array
        </button>

        <button
          onClick={() => {
            if (isSorting) stopSorting.current = true;
            else {
              switch (algorithm) {
                case "bubbleSort":
                  bubbleSort();
                  break;
                case "selectionSort":
                  selectionSort();
                  break;
                case "insertionSort":
                  insertionSort();
                  break;
                case "quickSort":
                  quickSort();
                  break;
                case "heapSort":
                  heapSort();
                  break;
                case "mergeSort":
                  mergeSort();
                  break;
              }
            }
          }}
          className="px-4 py-2 bg-green-600 rounded disabled:opacity-50"
        >
          {isSorting ? "Stop Sorting" : "Start Sorting"}
        </button>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-400" /> Comparing
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500" /> Swapping
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500" /> Sorted
        </div>
      </div>

      {/* Visualization */}
      <div className="flex items-end h-64 w-full max-w-6xl mx-auto bg-gray-800 p-4 rounded-lg gap-px">
        {array.map((value, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{
              height: `${getBarHeight(value)}px`,
              backgroundColor: sortedIndices.includes(i)
                ? "#10B981"
                : activeIndices.includes(i)
                ? "#EF4444"
                : "#3B82F6",
            }}
            transition={{ duration: 0.2 }}
            className="w-full rounded-t"
          />
        ))}
      </div>
    </div>
  );
};

export default SortingVisualizer;
