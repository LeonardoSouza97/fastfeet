import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async index(req, res) {
    const deliverysMans = await Deliveryman.findAll({
      attributes: ['name', 'email', 'avatar_id'],
      include: { model: File, as: 'avatar', attributes: ['url', 'path'] },
    });

    return res.json(deliverysMans);
  }

  async store(req, res) {
    const schema = Yup.object({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Campos inválidos' });
    }

    const { id, name, email } = await Deliveryman.create(req.body);

    return res.status(201).json({ id, name, email });
  }

  async update(req, res) {
    const schema = Yup.object({
      id: Yup.number().required(),
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    const { id } = req.body;

    const deliveryMan = await Deliveryman.findByPk(id);

    if (!deliveryMan) {
      return res.status(400).json({ error: 'Entregador não encontrado' });
    }

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Campos inválidos' });
    }

    const { name, email } = await deliveryMan.update(req.body);

    return res.json({ id, name, email });
  }

  async delete(req, res) {
    const { id } = req.params;
    const deliveryMan = await Deliveryman.findByPk(id);

    if (!deliveryMan) {
      return res.status(400).json({ error: 'Entregador não encontrado' });
    }

    await Deliveryman.destroy({ where: { id } });

    return res.status(204).json({ message: 'Deletado com sucesso' });
  }
}

export default new DeliverymanController();
