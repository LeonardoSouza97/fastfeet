import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import Queue from '../lib/Queue';
import CancellationDeliveryEmail from '../jobs/CancellationDeliveryEmail';

class CancelProblemController {
  async delete(req, res) {
    const { id } = req.params;

    const deliveryProblem = await DeliveryProblem.findByPk(id);

    if (!deliveryProblem) {
      return res
        .status(400)
        .json({ error: 'Não foram encontrados problemas com esse ID' });
    }

    const delivery = await Delivery.findOne({
      where: {
        id: deliveryProblem.delivery_id,
        canceled_at: null,
      },
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name'],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!delivery) {
      return res.status(400).json({ error: 'Encomenda já foi cancelada' });
    }

    await delivery.update({
      canceled_at: new Date(),
    });

    await Queue.add(CancellationDeliveryEmail.key, { delivery });

    return res.status(204).json({ message: 'Encomenda cancelada com sucesso' });
  }
}

export default new CancelProblemController();
