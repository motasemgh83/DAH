async function listAssets(req, res, next) {
  try {
    const data = await prisma.asset.findMany({
      include: {
        unit: {
          include: {
            branch: {
              include: {
                property: {
                  include: {
                    client: true,
                  },
                },
              },
            },
          },
        },
        serviceCategory: true,
        preventivePlans: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    res.json({ data });
  } catch (error) {
    next(error);
  }
}
