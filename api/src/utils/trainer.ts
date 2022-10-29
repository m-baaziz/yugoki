import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { Trainer } from '../generated/graphql';

export function parseTrainer(item: Record<string, AttributeValue>): Trainer {
  return {
    id: item.TrainerId.S,
    club: item.ClubId.S,
    description: item.TrainerDescription.S,
    displayname: item.TrainerDisplayname.S,
    firstname: item.TrainerFirstname.S,
    lastname: item.TrainerLastname.S,
    photo: item.TrainerPhoto?.S,
  };
}

export function trainerToRecord(
  trainer: Trainer,
): Record<string, AttributeValue> {
  return {
    TrainerId: { S: trainer.id },
    ClubId: { S: trainer.club },
    TrainerDescription: { S: trainer.description },
    TrainerDisplayname: { S: trainer.displayname },
    TrainerFirstname: { S: trainer.firstname },
    TrainerLastname: { S: trainer.lastname },
    TrainerPhoto: trainer.photo ? { S: trainer.photo } : { S: '' },
  };
}
