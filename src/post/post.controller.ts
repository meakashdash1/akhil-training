import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Db, MongoClient, ObjectId } from 'mongodb';

@Controller('post')
export class PostController {
  private db: Db;
  private client: MongoClient;
  constructor() {
    this.client = new MongoClient(
      'mongodb+srv://dashakashkumar636:xTu5AeJqrusv94tI@cluster0.rdmzbqo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    );
    this.connect().then(() => {
      this.db = this.client.db('TRAINING');
    });
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
      this.db = this.client.db('TRAINING');
    } catch (error) {
      throw error;
    }
  }

  @Post('create-post')
  async createPost(@Body() reqBody: any) {
    try {
      const postItem = [
        {
          title: 'Post Title 2',
          body: 'Body of post.',
          category: 'Event',
          likes: 2,
          tags: ['news', 'events'],
          date: Date(),
        },
        {
          title: 'Post Title 3',
          body: 'Body of post.',
          category: 'Technology',
          likes: 3,
          tags: ['news', 'events'],
          date: Date(),
        },
        {
          title: 'Post Title 4',
          body: 'Body of post.',
          category: 'Event',
          likes: 4,
          tags: ['news', 'events'],
          date: Date(),
        },
      ];
      const db = this.client.db('TRAINING');
      const collection = db.collection('POSTS');
      const response = await collection.insertMany(postItem);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Get()
  async getPosts() {
    try {
      const db = this.client.db('TRAINING');
      const collection = db.collection('POSTS');
      // console.log(collection)
      const response = collection
        .find({ category: 'Event' }, { projection: { title: 1, date: 1 } })
        .toArray();
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Put()
  async updatePost(@Body() reqBody: any) {
    try {
      const db = this.client.db('TRAINING');
      const collection = db.collection('POSTS');
      const response = collection.updateMany(
        { category: 'Event' },
        { $inc: { likes: 1 } },
      );
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    try {
      const db = this.client.db('TRAINING');
      const collection = db.collection('POSTS');
      const response = collection.deleteMany({ category: 'Event' });
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Get('aggregate')
  async getAggregation(@Body() reqBody: any) {
    try {
      const db = this.client.db('TRAINING');
      const collection = db.collection('POSTS');
    //   const pipeline = [
    //     { $match: { tags: reqBody.tags } },
    //     { $sort: { likes: -1 } },
    //     { $limit: 2 },
    //     {
    //       $match: {
    //         date: {
    //           $gte: new Date('2024-05-14T00:00:00.000Z'),
    //           $lt: new Date('2024-05-21T00:00:00.000Z'),
    //         },
    //       },
    //     },
    //   ];
    // const pipeline=[
    //     {
    //         $match:{tags:{$in:["news","events"]}}
    //     }
    // ]
    const pipeline=[
        {
            $match:{category:'Event'},
        },
        {
            $addFields:{likes:{$add:["$likes",1]}}
        },
        {
            $merge:{
                into:'POSTS',
                whenMatched:'merge',
                whenNotMatched:'discard'
            }
        }
    ]
      const response = await collection.aggregate(pipeline).toArray();
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
