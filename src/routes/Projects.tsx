import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import Input from "../components/Input";
import Header from "../layout/Header";
import { Project } from "../types";
import "../assets/css/routes/Projects.css";
import Modal from "../components/Modal";
import { useHistory } from "react-router-dom";
import validator from "validator";
import { authClient, useToken } from "../assets/api.config";

export const Projects = () => {
  const token = useToken();
  const [URL, setURL] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [email, setEmail] = useState<string>();
  const { push } = useHistory();

  useEffect(() => {
    const queryInfo = { active: true, lastFocusedWindow: true };

    chrome.tabs &&
      chrome.tabs.query(queryInfo, (tabs) => {
        const url = tabs[0].url;
        setURL(url ?? "");
      });
  }, []);

  useEffect(() => {
    authClient(token)
      .get("/projects")
      .then((res: any) => {
        const proj: Project[] = res.data.projects ?? [];

        setProjects(proj);
      });
  }, [token]);

  useEffect(() => {
    if (URL) {
      for (const proj of projects) {
        if (URL.includes(proj.base_url)) {
          push("/project/" + proj._id);
          break;
        }
      }
    }
  }, [URL, projects, push]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleCreateProject = async (event: any) => {
    event.preventDefault();
    const response: any = await authClient(token).post("/project", formData);
    setProjects([...projects, { ...response.data.project }]);
    setShowForm(false);
  };

  const openURL = (base_url: string) => {
    chrome.tabs.update({ url: base_url });
  };

  const handleAddContributor = async (project: Project) => {
    await authClient(token).put(`/project/contributor/${project._id}`, {
      email,
    });
  };

  return (
    <div>
      <Header />
      <div className="fl-ce">
        <button onClick={() => setShowForm(true)}>New +</button>
      </div>
      <Modal isShowing={showForm} onClose={() => setShowForm(false)}>
        <form className="fl-col-ce">
          <Input name="title" label="Title" required onChange={handleChange} />
          <Input name="desc" label="Description" onChange={handleChange} />
          <Input
            name="base_url"
            label="Base URL"
            required
            onChange={handleChange}
          />
          <button onClick={handleCreateProject}>Submit</button>
        </form>
      </Modal>
      <div className="projects-container">
        {projects.map((project) => {
          return (
            <Card key={project._id}>
              <div className="project-title">{project.title}</div>
              <div className="project-desc">{project.desc}</div>
              <div className="project-btns">
                <button
                  className="project-btn"
                  onClick={() => openURL(project.base_url)}
                >
                  Open
                </button>
                <button
                  className="project-btn"
                  onClick={() => push(`/project/${project._id}`)}
                >
                  Track
                </button>
              </div>
              <div className="add-input">
                <Input
                  name="email"
                  label=""
                  validator={validator.isEmail}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <button
                  disabled={!validator.isEmail(email ?? "")}
                  onClick={() => handleAddContributor(project)}
                >
                  Add User
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
