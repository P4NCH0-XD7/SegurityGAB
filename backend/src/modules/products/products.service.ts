import { Injectable, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  private normalizeSlug(name: string) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private async generateUniqueSlug(name: string, excludeId?: number): Promise<string> {
    const base = this.normalizeSlug(name);
    let slug = base;
    let i = 1;
    while (true) {
      const where: any = { slug };
      if (excludeId) where.id = Not(excludeId);
      const existing = await this.productRepository.findOne({ where });
      if (!existing) return slug;
      slug = `${base}-${i++}`;
    }
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({ relations: ['category'] });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id }, relations: ['category'] });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Ensure slug uniqueness before saving
    const slug = await this.generateUniqueSlug(createProductDto.name);
    const product = this.productRepository.create({ ...createProductDto, slug });
    return this.productRepository.save(product);
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    // If name is being updated, regenerate slug ensuring uniqueness
    if (updateProductDto.name) {
      const slug = await this.generateUniqueSlug(updateProductDto.name, id);
      updateProductDto = { ...updateProductDto, } as UpdateProductDto;
      (updateProductDto as any).slug = slug;
    }
    const updated = this.productRepository.merge(product, updateProductDto as any);
    return this.productRepository.save(updated);
  }

  async remove(id: number, hard = false): Promise<void> {
    const product = await this.findOne(id);
    if (hard) {
      // permanent delete
      await this.productRepository.remove(product);
    } else {
      // soft delete
      await this.productRepository.softRemove(product);
    }
  }

  async proxyImage(url: string, res: Response) {
    if (!url) {
      return res.status(400).send('URL is required');
    }

    try {
      let targetUrl = url;
      
      // Si es un link de Google Drive, lo convertimos al formato de descarga directa
      const driveMatch = url.match(/(?:\/file\/d\/|id=)([a-zA-Z0-9_-]+)/);
      if (driveMatch && driveMatch[1]) {
        targetUrl = `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`;
      }

      // Si es un link de GitHub blob viewer, lo convertimos a raw
      // Ejemplo: https://github.com/user/repo/blob/branch/path/file.png
      // ->       https://raw.githubusercontent.com/user/repo/branch/path/file.png
      const githubBlobMatch = url.match(/github\.com\/([^/]+\/[^/]+)\/blob\/(.+)/);
      if (githubBlobMatch) {
        targetUrl = `https://raw.githubusercontent.com/${githubBlobMatch[1]}/${githubBlobMatch[2]}`;
      }

      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (!response.ok) {
        return res.status(response.status).send('Error fetching image from source');
      }

      const contentType = response.headers.get('content-type');
      if (contentType) {
        res.setHeader('Content-Type', contentType);
      }

      // Copiamos el cache-control si existe o ponemos uno por defecto
      res.setHeader('Cache-Control', 'public, max-age=86400');

      // Convertir el body (ReadableStream) a un buffer y enviarlo
      // NestJS con Express prefiere Buffers o Streams de Node. 
      // fetch en Node devuelve un ReadableStream de la Web API.
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      return res.send(buffer);
    } catch (error) {
      console.error('Image Proxy Error:', error);
      return res.status(500).send('Internal server error during image proxy');
    }
  }
}
