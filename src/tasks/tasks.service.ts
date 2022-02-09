import { Cron, Timeout } from '@nestjs/schedule';
import { Verification } from './../verification/schemas/verification.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { syncProducts } from 'pim/sync/akeneo/index';
import { mongoClientWrapper } from 'pim/api/mongo';
import { create } from 'pim/sync/create';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel('VerificationCodes')
    private readonly verificationModel: Model<Verification>,
  ) {}

  private readonly logger = new Logger(TasksService.name);

  @Cron('0 10 * * * *')
  private async deleteVerificationCodes() {
    const currentTime = Date.now();
    try {
      const deletedCodes = await this.verificationModel.deleteMany({
        createdDate: { $lt: currentTime - 300000 },
      });
      this.logger.debug(deletedCodes);
    } catch (error) {}
  }

  @Timeout(1000)
  private async syncProductListLookup() {
    create();
  }

  @Cron('0 0 2 * * *')
  private async syncProductsAndCatalog() {
    try {
      syncProducts('aks_akeneo').then(async (mongoClientWrapper) => {
        this.logger.debug('started sync');
        await mongoClientWrapper(async (err, client) => {
          if (err) {
            this.logger.error(err.message);
          }
          const cursor = await client
            .db('aks_akeneo')
            .collection('products')
            .aggregate([
              {
                $project: {
                  _id: 0,
                  name: 1,
                  prices: 2,
                  images: 3,
                },
              },
              { $out: { db: 'aks_akeneo', coll: 'product_lookup' } },
            ]);
          let next = null;
          do {
            next = await cursor.next();
          } while (next != null);
          this.logger.debug('end sync');
        });
      });
    } catch (error) {
      this.logger.error(`[Sync: ERROR] ${error.message}`);
    }
  }
}
