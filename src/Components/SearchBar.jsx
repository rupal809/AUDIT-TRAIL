function SearchBar({
  shipmentId,
  setShipmentId,
  onSearch,
  loading,
  suggestions = [],
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(shipmentId);
  };

  return (
    <div className="search-wrapper">
      <form className="search-section" onSubmit={handleSubmit} role="search">
        <input
          type="text"
          placeholder="Enter Shipment / Container ID (e.g. MSKU1234567)"
          value={shipmentId}
          onChange={(event) => setShipmentId(event.target.value)}
          aria-label="Shipment ID"
          maxLength={40}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {suggestions.length > 0 && (
        <div className="suggestions">
          <span>Demo IDs:</span>
          {suggestions.map((id) => (
            <button
              key={id}
              type="button"
              className="chip"
              onClick={() => {
                setShipmentId(id);
                onSearch(id);
              }}
            >
              {id}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
