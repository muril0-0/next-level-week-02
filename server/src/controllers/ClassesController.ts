import { Request, Response } from "express";

import db from "../database/connection";
import convertHoursToMinutes from "../utils/convertHoursToMinutes";

interface scheduleItem {
  week_day: number;
  from: string;
  to: string;
}

export default class ClassesController {
  async index(request: Request, response: Response) {
    const filters = request.query;

    const week_day = filters.week_day as string;
    const subject = filters.subject as string;
    const time = filters.time as string;

    if (!filters.week_day || !filters.subject || !filters.time) {
      return response.status(400).json({
        error: "Missing filters from search classes.",
      });
    }

    const timeInMinutes = convertHoursToMinutes(time);

    const classes = await db("classes")
      .whereExists(function () {
        this.select("class_schedule.*")
          .from("class_schedule")
          .whereRaw("`class_schedule`.`class_id` = `classes`.`id`")
          .whereRaw("`class_schedule`.`week_day` = ??", [Number(week_day)])
          .whereRaw("`class_schedule`.`from` <= ??", [timeInMinutes])
          .whereRaw("`class_schedule`.`to` > ??", [timeInMinutes]);
      })
      .where("classes.subject", "=", subject)
      .join("users", "classes.user_id", "=", "users.id")
      .select(["classes.*", "users.*"]);

    return response.json(classes);
  }

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
