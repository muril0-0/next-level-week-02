import { Request, Response } from "express";

import db from "../database/connection";
import convertHoursToMinutes from "../utils/convertHoursToMinutes";

interface scheduleItem {
  week_day: number;
  from: string;
  to: string;
}

export default class ClassesController {
  async create(request: Request, response: Response) {
    const {
      name,
      avatar,
      whatsapp,
      bio,
      subject,
      cost,
      schedule,
    } = request.body;

    const trx = await db.transaction(); //executa todas as inserções de uma vez, se alguma falhar, cancela todas

    try {
      const insertedUsersId = await trx("users").insert({
        //O insert serve para adicionar vários itens, por isso ele retorna um array com os ids dos itens inseridos
        name: name,
        avatar: avatar,
        whatsapp: whatsapp,
        bio: bio, //daria pra usar short sentence, já que o nome e contepudo são iguais
      });

      const user_id = insertedUsersId[0]; //Capturamos apenas o primeiro id do array, já que só vamos inserir 1 item

      const insertedClassesId = await trx("classes").insert({
        subject,
        cost,
        user_id,
      });

      const class_id = insertedClassesId[0];

      const classSchedule = schedule.map((scheduleItem: scheduleItem) => {
        return {
          class_id,
          week_day: scheduleItem.week_day,
          from: convertHoursToMinutes(scheduleItem.from),
          to: convertHoursToMinutes(scheduleItem.to),
        };
      });

      await trx("class_schedule").insert(classSchedule);

      await trx.commit(); // se não deu nada errado, commita as alterações ao mesmo tempo

      return response.status(201).send();
    } catch (err) {
      await trx.rollback(); //desfazer alterações
      return response.status(400).json({
        error: "Unexpected error while creating new class.",
      });
    }
  }
}
