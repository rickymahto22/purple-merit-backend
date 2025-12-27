import { Response } from 'express';
import Project from '../models/Project';
import { AuthRequest } from '../middleware/auth';

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.create({
      name: req.body.name,
      description: req.body.description,
      ownerId: req.user.id
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
};

export const getMyProjects = async (req: AuthRequest, res: Response) => {
  const projects = await Project.findAll({ where: { ownerId: req.user.id } });
  res.json(projects);
};