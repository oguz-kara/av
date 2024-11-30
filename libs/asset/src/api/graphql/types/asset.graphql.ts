import { Field, ObjectType } from '@nestjs/graphql'
import {
  IsMimeType,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator'

@ObjectType()
export class AssetType {
  @Field()
  @IsUUID()
  id: string

  @Field()
  @IsString()
  originalName: string

  @Field()
  @IsString()
  name: string

  @Field()
  @IsString()
  type: string

  @Field()
  @IsMimeType()
  mimeType: string

  @Field()
  @IsNumber()
  fileSize: number

  @Field()
  @IsString()
  source: string

  @Field()
  @IsString()
  preview?: string

  @Field()
  @IsString()
  storageProvider?: string

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  width?: number

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  height?: number

  @Field({ nullable: true })
  focalPoint?: string

  @Field({ nullable: true })
  createdAt?: Date

  @Field({ nullable: true })
  updatedAt?: Date

  @Field({ nullable: true })
  updatedBy?: string

  @Field({ nullable: true })
  createdBy?: string

  @Field({ nullable: true })
  deletedAt?: Date

  @Field({ nullable: true })
  deletedBy?: string
}
