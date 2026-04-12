import { useState } from "react";
import { useEffect } from "react";
import axios from "../utils/axios";
import { useNavigate, useSearchParams } from "react-router-dom";

const Search = () => {
  const [q, setQ] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const current = (searchParams.get("q") || "").trim();
    setQ(current);

    const run = async () => {
      if (!current) {
        setUsers([]);
        setError("");
        return;
      }

      try {
        setError("");
        const res = await axios.get(`/users/search?q=${encodeURIComponent(current)}`);
        setUsers(res.data.data || []);
      } catch {
        setError("Search failed. Try again.");
      }
    };

    run();
  }, [searchParams]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!q.trim()) {
      setUsers([]);
      setSearchParams({});
      return;
    }

    try {
      setError("");
      setSearchParams({ q: q.trim() });
      const res = await axios.get(`/users/search?q=${encodeURIComponent(q.trim())}`);
      setUsers(res.data.data || []);
    } catch {
      setError("Search failed. Try again.");
    }
  };

  return (
    <div className="content-area">
      <form onSubmit={handleSearch}>
        <input
          placeholder="Search users"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </form>

      {error ? <p>{error}</p> : null}

      {users.map((u) => (
        <div
          key={u._id}
          style={{ display: "flex", gap: 12, cursor: "pointer" }}
          onClick={() => navigate(`/channel/${u.username}`)}
        >
          <img src={u.avatar} width={40} height={40} />
          <div>
            <div>{u.fullName}</div>
            <div>@{u.username}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Search;
