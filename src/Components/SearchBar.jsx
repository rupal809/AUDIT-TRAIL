function SearchBar({
  shipmentId,
  setShipmentId,
  onSearch,
  loading,
}) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="search-section">

      <input
        type="text"
        placeholder="Enter Shipment ID..."
        value={shipmentId}
        onChange={(event) =>
          setShipmentId(event.target.value)
        }
        onKeyDown={handleKeyDown}
      />

      <button
        onClick={onSearch}
        disabled={loading}
      >
        {loading ? "Searching..." : "Search"}
      </button>

    </div>
  );
}

export default SearchBar;