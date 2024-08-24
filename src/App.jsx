import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Hazem",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  // Start States
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectFriend, setSelectFriend] = useState("");

  // start Function
  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
    setSelectFriend("");
  }
  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }
  function handleSelection(friend) {
    // setSelectFriend(friend );
    setSelectFriend((cur) => (cur.id === friend.id ? "" : friend));
  }
  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectFriend("")
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelection={handleSelection}
          selectFriend={selectFriend}
        />
        {showAddFriend && selectFriend === "" && (
          <FormAddFriend
            onAddFriend={handleAddFriend}
            className={{ showAddFriend } && "fade-in  form-add-friend"}
          />
        )}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend === true && selectFriend === ""
            ? " Clase"
            : "Add Friend"}
        </Button>
      </div>
      <div>
        {selectFriend && (
          <FormSpliteBill
            selectFriend={selectFriend}
            onSplitBill={handleSplitBill}
          />
        )}
      </div>
    </div>
  );
}

function FriendsList({ friends, onSelection, selectFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          selectFriend={selectFriend}
          onSelection={onSelection}
        />
      ))}
    </ul>
  );
}
function Friend({ friend, onSelection, selectFriend }) {
  const isSelected = selectFriend.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={"Not Found"} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even </p>}
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}
function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}
function FormAddFriend({ className, onAddFriend }) {
  // Start states
  const [name, setName] = useState("");
  const [image, setimage] = useState("https://i.pravatar.cc/48?u=499476");
  const id = crypto.randomUUID();

  function handleSubmit(event) {
    event.preventDefault();
    if (!name || !image) return;
    const newFiend = { name, image: `${image}?=${id}`, balance: 0, id };

    onAddFriend(newFiend);

    setName("");
    setimage("https://i.pravatar.cc/48?u=499476");
  }

  return (
    <form className={`${className}`} onSubmit={handleSubmit}>
      <label>👫friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>📷image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setimage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSpliteBill({ selectFriend, onSplitBill }) {
  // Start states
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectFriend.name}</h2>
      <label>💰Bill Value</label>
      <input
        type="number"
        value={bill}
        onChange={(e) => setBill(e.target.value)}
      />
      <label>🧍‍♂️Your expense</label>
      <input
        type="number"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(e.target.value > bill ? paidByUser : e.target.value)
        }
      />
      <label>👫{selectFriend.name}'is expense</label>
      <input type="number" disabled value={+paidByFriend} />
      <label>🤑How is paying the bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value={"user"}>You</option>
        <option value={"friend"}>{selectFriend.name}</option>
      </select>
      <Button

      >
        Split bill
      </Button>
    </form>
  );
}
