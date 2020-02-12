import { Op } from 'sequelize';
import { startOfDay, endOfDay } from 'date-fns';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';

class CheckinDeliveriesController {
  async update(req, res) {
    const { deliveryman_id } = req.body;

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Entregador não encontrada' });
    }

    const { id } = req.params;

    const dateNow = new Date();

    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id,
        start_date: { [Op.between]: [startOfDay(dateNow), endOfDay(dateNow)] },
      },
    });

    if (deliveries.length >= 5) {
      return res.status(400).json({ error: 'Número de retiradas excedido' });
    }

    const delivery = await Delivery.findOne({
      where: {
        id,
        deliveryman_id,
      },
    });

    if (!delivery) {
      return res.status(400).json({ error: 'Encomenda não encontrada' });
    }

    const deliveryUpdated = await delivery.update({
      start_date: dateNow,
    });

    return res.json(deliveryUpdated);
  }
}

export default new CheckinDeliveriesController();
