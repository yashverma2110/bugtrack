import React, { useEffect, useState, useCallback, useRef } from "react";
import Card from "../components/Card/Card";
import Input from "../components/Input/Input";
import Modal from "../components/Modal/Modal";
import UserSelector from "../components/UserSelector/UserSelector";
import Header from "../layout/Header/Header";
import { Bug, Project } from "../types";
import "../assets/css/routes/ProjectDetails.css";
import { useToken, authClient } from "../assets/api.config";

const Bugs = () => {
  const token = useToken();
  const [project, setProject] = useState<Project>();
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [formData, setFormData] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [URL, setURL] = useState("");
  const firstRender = useRef(false);

  useEffect(() => {
    const queryInfo = { active: true, lastFocusedWindow: true };

    chrome.tabs &&
      chrome.tabs.query(queryInfo, (tabs) => {
        const url = tabs[0].url;
        setURL(url ?? "");
      });
  }, []);

  useEffect(() => {
    const projectId = window.location.pathname.split("/")[2];

    authClient(token)
      .get(`/project/${projectId}`)
      .then((res: any) => {
        setProject(res.data.project[0]);
      });
    authClient(token)
      .get(`/bug/${projectId}`)
      .then((res: any) => {
        setBugs(res.data.bugs);
      });
  }, [token]);

  useEffect(() => {
    if (URL && bugs.length > 0 && !firstRender.current) {
      setBugs((bugList) => {
        const finalList = [];
        for (const bug of bugList) {
          if (URL.includes(bug.url)) {
            finalList.unshift(bug);
          } else {
            finalList.push(bug);
          }
        }
        return finalList;
      });
      firstRender.current = true;
    }
  }, [URL, bugs, project?.base_url]);

  const handleUserAssigning = useCallback((users: any[]) => {
    setFormData((data) => ({
      ...data,
      contributors: users,
    }));
  }, []);

  const handleNewUsersAssigning = useCallback((users: any[]) => {
    setUsers(users);
  }, []);

  const handleUserRemoval = async (bug: Bug, userId: string) => {
    await authClient(token).put(`/bug/contributor/remove/${bug._id}`, {
      userId,
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddBugs = async (event: any) => {
    const projectId = window.location.pathname.split("/")[2];

    event.preventDefault();
    const { data }: any = await authClient(token).post("/bug", {
      ...formData,
      in: projectId,
    });
    setBugs([{ ...data.bug }, ...bugs]);
    setShowForm(false);
  };

  const handleAssign = async (bugId: string) => {
    const projectId = window.location.pathname.split("/")[2];

    await authClient(token).put(`/bug/contributor/${bugId}`, {
      ids: users.map((user) => user.id),
    });

    await authClient(token)
      .get(`/bug/${projectId}`)
      .then((res: any) => {
        setBugs(res.data.bugs);
      });
  };

  return (
    <div>
      <Header />
      <div className="fl-ce">
        <div className="title">{project?.title}</div>
      </div>
      <div className="fl-ce">
        <button onClick={() => setShowForm(true)}>New +</button>
      </div>
      <Modal isShowing={showForm} onClose={() => setShowForm(false)}>
        <form className="fl-col-ce">
          <Input name="title" label="Title" required onChange={handleChange} />
          <Input name="desc" label="Description" onChange={handleChange} />
          <Input
            name="identifier"
            label="ID of the element"
            onChange={handleChange}
          />
          <Input
            name="url"
            label="Route (no base URL)"
            required
            defaultValue={URL}
            onChange={handleChange}
          />
          <UserSelector
            label="Assign to"
            users={project?.contributors ?? []}
            onChange={handleUserAssigning}
          />
          <button onClick={handleAddBugs}>Submit</button>
        </form>
      </Modal>
      <div className="bug-container">
        {bugs.map((bug) => {
          return (
            <Card key={bug._id}>
              <div className="bug-title">{bug.title}</div>
              <div className="bug-desc">{bug.desc}</div>
              <div className="bug-desc">{bug.url}</div>
              <UserSelector
                label="Assign to"
                users={(project?.contributors ?? []).filter((user: any) => {
                  for (let assigned of bug.contributors) {
                    if (assigned.id === user.id) {
                      return false;
                    }
                  }
                  return true;
                })}
                onChange={handleNewUsersAssigning}
              />
              <button onClick={() => handleAssign(bug._id)}>Assign</button>
              <div className="bug-label">Assigned to:</div>
              <div className="contributors-chip shadow-inset">
                {bug.contributors.length > 0 &&
                  bug.contributors.map((user: any) => {
                    return (
                      <div className="chip" key={user.id}>
                        {user.name}
                        <span
                          className="chip-delete"
                          onClick={() => handleUserRemoval(bug, user.id)}
                        >
                          x
                        </span>
                      </div>
                    );
                  })}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Bugs;
