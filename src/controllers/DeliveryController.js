import * as Yup from 'yup';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import Queue from '../lib/Queue';
import DeliveryEmail from '../jobs/DeliveryEmail';

class DeliveryController {
  async index(req, res) {
    const deliveries = await Delivery.findAll({
      where: { canceled_at: null },
      attributes: ['id', 'product', 'start_date', 'end_date'],
      include: [
        { model: Recipient, as: 'recipient' },
        { model: Deliveryman, as: 'deliveryman' },
      ],
    });

    if (!deliveries) {
      return res.json(204).json({ message: 'Nenhuma encomenda encontrada' });
    }

    return res.json(deliveries);
  }

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

  async update(req, res) {
    const schema = Yup.object({
      id: Yup.number().required(),
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Campos inválidos' });
    }

    const { id, recipient_id, deliveryman_id } = req.body;

    const deliveryExists = await Delivery.findByPk(id);

    if (!deliveryExists) {
      return res.status(400).json({ error: 'Encomenda não encontrada' });
    }

    const recipientExists = await Recipient.findByPk(recipient_id);

    if (!recipientExists) {
      return res.status(400).json({ error: 'Destinatário não encontrado' });
    }

    const deliveryManExists = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryManExists) {
      return res.status(400).json({ error: 'Entregador não encontrado' });
    }

    const { product } = await deliveryExists.update(req.body);

    return res.json({ id, product });
  }

  async delete(req, res) {
    const { id } = req.params;
    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: 'Encomenda não encontrada' });
    }

    await Delivery.destroy({ where: { id } });

    return res.status(204).json({ message: 'Encomenda deletada com sucesso' });
  }
}

export default new DeliveryController();
