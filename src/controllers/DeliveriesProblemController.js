import * as Yup from 'yup';
import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';

class DeliveriesProblemController {
  async index(req, res) {
    const deliveryProblems = await DeliveryProblem.findAll({
      attributes: ['id', 'description'],
      include: [
        {
          model: Delivery,
          as: 'deliveries',
          attributes: ['id', 'product', 'start_date', 'end_date'],
          include: [
            {
              model: Recipient,
              as: 'recipient',
              attributes: ['id', 'name'],
            },
            {
              model: Deliveryman,
              as: 'deliveryman',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
    });

    if (!deliveryProblems) {
      return res.status(400).json({ error: 'Não foram encontrados problemas' });
    }

    return res.json(deliveryProblems);
  }

  async show(req, res) {
    const { id: delivery_id } = req.params;

    const deliveryProblem = await DeliveryProblem.findAll({
      where: { delivery_id },
      attributes: ['id', 'description'],
    });

    if (!deliveryProblem) {
      return res
        .status(400)
        .json({ error: 'Não foram encontrados problemas com esta entrega' });
    }

    return res.json(deliveryProblem);
  }

  async store(req, res) {
    const schema = Yup.object({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'campos invalidos' });
    }

    const { id: delivery_id } = req.params;

    const delivery = await Delivery.findByPk(delivery_id);

    if (!delivery) {
      return res.status(400).json({ error: 'Entrega não encontrada' });
    }

    const { description } = req.body;

    const deliveryProblem = await DeliveryProblem.create({
      description,
      delivery_id,
    });

    return res.json(deliveryProblem);
  }
}

export default new DeliveriesProblemController();
