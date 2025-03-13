import React, { useState, useEffect, useRef, useCallback } from "react";
import { FixedSizeList as List } from "react-window";

const fetchData = (page) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newItems = Array.from(
        { length: 10 },
        (_, i) => `Item ${i + page * 10}`
      );
      resolve(newItems);
    }, 1000); // Simulate API delay
  });
};

export default function InfiniteVirtualizedList() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);

  // Fetch more items
  const loadMoreItems = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    const newItems = await fetchData(page);
    setItems((prev) => [...prev, ...newItems]);
    setPage((prev) => prev + 1);
    setLoading(false);
  }, [page, loading]);

  // Intersection Observer to detect when to load more
  const observerCallback = useCallback(
    (entries) => {
      if (entries[0].isIntersecting && !loading) {
        loadMoreItems();
      }
    },
    [loading, loadMoreItems]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      threshold: 1.0,
    });
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [observerCallback]);

  return (
    <div
      style={{
        height: "400px",
        width: "100%",
        overflow: "auto",
        border: "1px solid #ddd",
      }}
    >
      <List
        height={400}
        itemCount={items.length + 1}
        itemSize={50}
        width="100%"
      >
        {({ index, style }) => {
          if (index === items.length) {
            return (
              <div ref={observerRef} style={{ ...style, textAlign: "center" }}>
                {loading ? "Loading..." : "Load More"}
              </div>
            );
          }
          return (
            <div
              style={{
                ...style,
                padding: "10px",
                borderBottom: "1px solid #ddd",
              }}
            >
              {items[index]}
            </div>
          );
        }}
      </List>
    </div>
  );
}
