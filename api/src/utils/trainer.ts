import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { ClubDbObject, Trainer, TrainerDbObject } from '../generated/graphql';

export function dbTrainerToTrainer(
  trainer: TrainerDbObject,
  club: ClubDbObject,
): Trainer {
  const { _id, firstname, lastname, displayname, description, photo } = trainer;
  return {
    id: _id.toString(),
    firstname,
    lastname,
    displayname,
    description,
    photo,
    club: club._id.toString(),
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
    TrainerPhoto: trainer.photo ? { S: trainer.photo } : undefined,
  };
}

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
