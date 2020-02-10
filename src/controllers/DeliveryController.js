import * as Yup from 'yup';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import Queue from '../lib/Queue';
import DeliveryEmail from '../jobs/DeliveryEmail';

class DeliveryController {
  async store(req, res) {
    const schema = Yup.object({
      product: Yup.string().required(),
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Campos inválidos' });
    }

    const { recipient_id, deliveryman_id, product } = req.body;

    const recipient = await Recipient.findByPk(recipient_id);

    if (!recipient) {
      return res.status(400).json({ error: 'Destinatário não encontrado' });
    }

    const deliveryMan = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryMan) {
      return res.status(400).json({ error: 'Entregador não encontrado' });
    }

    const { id } = await Delivery.create({
      product,
      recipient_id,
      deliveryman_id,
    });

    const delivery = await Delivery.findByPk(id, {
      include: [
        { model: Recipient, as: 'recipient' },
        { model: Deliveryman, as: 'deliveryman' },
      ],
    });

    await Queue.add(DeliveryEmail.key, {
      delivery,
    });

    return res.status(201).json(delivery);
  }

  // async store(req, res) {}

  // async update(req, res) {}

  // async delete(req, res) {}
}

export default new DeliveryController();
