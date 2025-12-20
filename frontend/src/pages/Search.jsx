import { useState } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [q, setQ] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    const res = await axios.get(`/users/search?q=${q}`);
    setUsers(res.data.data);
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
