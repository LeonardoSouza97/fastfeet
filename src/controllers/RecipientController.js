import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object({
      name: Yup.string().required(),
      address: Yup.string().required(),
      city: Yup.string().required(),
      state: Yup.string().required(),
      number: Yup.string().required(),
      complement: Yup.string(),
      cep: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Campos inválidos' });
    }
    const recipient = await Recipient.create(req.body);

    return res.json(recipient);
  }

  async update(req, res) {
    const schema = Yup.object({
      id: Yup.number().required(),
      name: Yup.string(),
      address: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      number: Yup.string(),
      complement: Yup.string(),
      cep: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Campos inválidos' });
    }
    const { id } = req.body;

    const recipientExists = await Recipient.findByPk(id);

    if (!recipientExists) {
      res.status(400).json({ error: 'Destinatário não existente' });
    }

    const recipient = await recipientExists.update(req.body);

    return res.json(recipient);
  }
}

export default new RecipientController();
