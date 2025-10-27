import {
  type User,
  type InsertUser,
  type Dataset,
  type InsertDataset,
  type Visualization,
  type InsertVisualization,
  type Insight,
  type InsertInsight,
  type Share,
  type InsertShare,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  createDataset(dataset: InsertDataset): Promise<Dataset>;
  getDataset(id: string): Promise<Dataset | undefined>;
  getAllDatasets(): Promise<Dataset[]>;
  deleteDataset(id: string): Promise<boolean>;

  createVisualization(
    visualization: InsertVisualization
  ): Promise<Visualization>;
  getVisualization(id: string): Promise<Visualization | undefined>;
  getVisualizationsByDataset(datasetId: string): Promise<Visualization[]>;
  deleteVisualization(id: string): Promise<boolean>;

  createInsight(insight: InsertInsight): Promise<Insight>;
  getInsight(id: string): Promise<Insight | undefined>;
  getInsightsByDataset(datasetId: string): Promise<Insight[]>;
  deleteInsight(id: string): Promise<boolean>;

  createShare(share: InsertShare): Promise<Share>;
  getShare(id: string): Promise<Share | undefined>;
  getShareByToken(token: string): Promise<Share | undefined>;
  getSharesByDataset(datasetId: string): Promise<Share[]>;
  deleteShare(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private datasets: Map<string, Dataset>;
  private visualizations: Map<string, Visualization>;
  private insights: Map<string, Insight>;
  private shares: Map<string, Share>;

  constructor() {
    this.users = new Map();
    this.datasets = new Map();
    this.visualizations = new Map();
    this.insights = new Map();
    this.shares = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createDataset(insertDataset: InsertDataset): Promise<Dataset> {
    const id = randomUUID();
    const dataset: Dataset = {
      ...insertDataset,
      id,
      createdAt: new Date(),
    };
    this.datasets.set(id, dataset);
    return dataset;
  }

  async getDataset(id: string): Promise<Dataset | undefined> {
    return this.datasets.get(id);
  }

  async getAllDatasets(): Promise<Dataset[]> {
    return Array.from(this.datasets.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async deleteDataset(id: string): Promise<boolean> {
    return this.datasets.delete(id);
  }

  async createVisualization(
    insertVisualization: InsertVisualization
  ): Promise<Visualization> {
    const id = randomUUID();
    const visualization: Visualization = {
      ...insertVisualization,
      id,
      createdAt: new Date(),
    };
    this.visualizations.set(id, visualization);
    return visualization;
  }

  async getVisualization(id: string): Promise<Visualization | undefined> {
    return this.visualizations.get(id);
  }

  async getVisualizationsByDataset(
    datasetId: string
  ): Promise<Visualization[]> {
    return Array.from(this.visualizations.values()).filter(
      (v) => v.datasetId === datasetId
    );
  }

  async deleteVisualization(id: string): Promise<boolean> {
    return this.visualizations.delete(id);
  }

  async createInsight(insertInsight: InsertInsight): Promise<Insight> {
    const id = randomUUID();
    const insight: Insight = {
      ...insertInsight,
      id,
      createdAt: new Date(),
    };
    this.insights.set(id, insight);
    return insight;
  }

  async getInsight(id: string): Promise<Insight | undefined> {
    return this.insights.get(id);
  }

  async getInsightsByDataset(datasetId: string): Promise<Insight[]> {
    return Array.from(this.insights.values()).filter(
      (i) => i.datasetId === datasetId
    );
  }

  async deleteInsight(id: string): Promise<boolean> {
    return this.insights.delete(id);
  }

  async createShare(insertShare: InsertShare): Promise<Share> {
    const id = randomUUID();
    const share: Share = {
      ...insertShare,
      id,
      createdAt: new Date(),
    };
    this.shares.set(id, share);
    return share;
  }

  async getShare(id: string): Promise<Share | undefined> {
    return this.shares.get(id);
  }

  async getShareByToken(token: string): Promise<Share | undefined> {
    return Array.from(this.shares.values()).find(
      (s) => s.shareToken === token
    );
  }

  async getSharesByDataset(datasetId: string): Promise<Share[]> {
    return Array.from(this.shares.values()).filter(
      (s) => s.datasetId === datasetId
    );
  }

  async deleteShare(id: string): Promise<boolean> {
    return this.shares.delete(id);
  }
}

export const storage = new MemStorage();
