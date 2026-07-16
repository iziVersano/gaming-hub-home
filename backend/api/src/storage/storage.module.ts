import { Global, Module } from '@nestjs/common';
import { JsonStorageService } from './json-storage.service';
import { EmailService } from '../email/email.service';

@Global()
@Module({
  providers: [JsonStorageService, EmailService],
  exports: [JsonStorageService, EmailService],
})
export class StorageModule {}
