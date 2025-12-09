const Project = require('../models/Project')
const Task = require("../models/Task")


async function getProjects(req, res){
    try {
    const userProjects = await Project.find({ user: req.user._id });

    res.json(userProjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

async function getProjectById(req, res){
    try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
      return res
        .status(404)
        .json({ message: `Project with id: ${projectId} not found!` });
    }

    // Authorization
    console.log(req.user._id);
    console.log(project.user);
    
    if (project.user.toString() !== req.user._id) {
      return res.status(403).json({ message: "User is not authorized!" });
    }

    res.json(project);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

async function createProject(req, res){
    try {
    const newProject = await Project.create({
      ...req.body,
      user: req.user._id,
    });

    res.status(201).json(newProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

async function updateProject(req, res){
    try {
    const projectToUpdate = await Project.findById(req.params.projectId) 

    if(req.user._id !== projectToUpdate.user.toString()){ //localhost/project/123                       |mila's lab
        return res.status(403).json({message: "User is not authorized to update this project"})
    }

    const project = await Project.findByIdAndUpdate( req.params.projectId, req.body,{new:true} )  //questions
    res.json(project);

  } catch (error) {
    res.status(500).json({error: error.message})
  }
}

// async function deleteProject(req, res){
//       try {
//       await Task.deleteMany({project:project._id})//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//      const deleteProject = await Project.findById(req.params.projectId) 

//     if(req.user._id !== deleteProject.user.toString()){ //localhost/project/123                       |mila's lab
//         return res.status(403).json({message: "User is not authorized to update this project"})
//     }

//     const project = await Project.findByIdAndDelete(req.params.projectId);

//     res.json({message: "Project deleted"})
//   } catch (error) {
//      res.status(500).json({error: error.message})
//   }
// }

async function deleteProject(req, res) {
  try {
    // First, find the project to check if it exists and authorize
    const projectToDelete = await Project.findById(req.params.projectId);

    if (!projectToDelete) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (req.user._id !== projectToDelete.user.toString()) {
      return res.status(403).json({ message: "User is not authorized to delete this project" });
    }

    // Now delete related tasks using the project ID (no need for 'project' variable here)
    await Task.deleteMany({ project: req.params.projectId });

    // Finally, delete the project itself
    await Project.findByIdAndDelete(req.params.projectId);

    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
module.exports = {getProjects, getProjectById, createProject, updateProject, deleteProject}