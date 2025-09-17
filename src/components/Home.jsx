import { useEffect, useMemo, useRef, useState } from "react"


export default function HomePage() {
    const [dialogueId, setDialogueId] = useState(null);

    const handleDialogue = (id) => {
        setDialogueId(id); // open dialogue for this item
    };

    const closeDialogue = () => {
        setDialogueId(null); // close all dialogues
    };

    const [id, setId] = useState(() => {
        const storedId = localStorage.getItem("id");
        return storedId ? JSON.parse(storedId) : 0; // start at 0 if none saved
    });
    const [name, setName] = useState("")
    const [date, setDate] = useState("")
    const [entry, setEntry] = useState("")
    const [active, setActive] = useState(() => {
        const stored = localStorage.getItem("active");
        return stored ? JSON.parse(stored) : false;
    });
    const [items, setItems] = useState(() => {
        const storedItems = localStorage.getItem("items");
        return storedItems ? JSON.parse(storedItems) : [];
    });

    useEffect(() => {
        localStorage.setItem("id", JSON.stringify(id));
    }, [id]);
    useEffect(() => {
        localStorage.setItem("active", JSON.stringify(active));
    }, [active]);
    useEffect(() => {
        localStorage.setItem("items", JSON.stringify(items));
        console.log(items);
    }, [items]);

    const [editId, setEditId] = useState(null); // track item being edited

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editId !== null) {
            // update existing
            setItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === editId ? { ...item, name, date, entry } : item
                )
            );
            setEditId(null); // reset
        } else {
            // add new
            const newItem = { name, date, entry, id };
            setItems((prevItems) => [...prevItems, newItem]);
            setId(Math.random);
        }

        // reset form
        setName("");
        setDate("");
        setEntry("");
        setActive(true);
    };

    // fill form with item data when edit is clicked
    const handleEdit = (item) => {
        setName(item.name);
        setDate(item.date);
        setEntry(item.entry);
        setEditId(item.id);
    };
    const handleDelete = (deleteId) => {
        setItems((prevItems) => prevItems.filter(item => item.id !== deleteId));
    };

    
    return (
        <div className="parent">

            <div className="card">
                <h1>Mini Journal With CRUD</h1>
                <div className="inputs">
                    <form onSubmit={handleSubmit}>
                        <div className="split">
                            <input className="date-form" type="text" placeholder="Enter Your Entry Title" value={name} onChange={(e) => setName(e.target.value)} required />
                            <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required />
                        </div>
                        <textarea type="text" placeholder="Make Your Entry" value={entry} onChange={(e) => setEntry(e.target.value)} required />
                        <button>Save</button>
                    </form>
                </div>
                {items.length > 0 && (
                    <div className="search active">
                        {items.map((item) => (
                            <div key={item.id} className="results">
                                <h1>{item.name}</h1>
                                <p className="text date">Entry made at {item.date}</p>
                                <p className="text">{item.entry}</p>

                                {dialogueId === item.id && (
                                    <div className="dialogue active">
                                        <h1>Are you sure?</h1>
                                        <div className="btns">
                                            <button
                                                className="del"
                                                onClick={() => {
                                                    handleDelete(item.id);
                                                    closeDialogue();
                                                }}
                                            >
                                                Yes
                                            </button>
                                            <button className="edit" onClick={closeDialogue}>
                                                No
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="btns">
                                    <button className="del" onClick={() => handleDialogue(item.id)}>
                                        Delete
                                    </button>
                                    <button className="edit" onClick={() => handleEdit(item)}>
                                        Edit
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>

        </div>
    )
}